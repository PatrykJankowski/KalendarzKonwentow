import { formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { LoadingController } from '@ionic/angular';

import { Geolocation, Network, Toast } from '@capacitor/core';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';
import { FiltersService } from '@services/filters.service';
import { log } from 'util';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements OnInit, OnChanges {
  @Input() enableDate = false;
  @Input() enableVoivodeship = false;
  @Input() fav = false;
  @Input() inRange = false;
  @Input() events: Array<Event>;
  @Output() eventsFiltered = new EventEmitter();

  public originalEvents: Array<Event>;

  public categoryFilter: FormControl;
  public voivodeshipFilter: FormControl;
  public locationFilter: FormControl;
  public dateFilter: FormControl;
  public rangeFilter: FormControl;
  public searchField: FormControl;

  public lat;
  public long;

  public categories: Array<string> = [];
  public voivodeships: Array<string> = [];
  public locations: Array<string> = [];
  public dates: Array<number> = [];

  public category = '';
  public voivodeship = '';
  public location = '';
  public date = '';
  public range = 999999;
  public searchingTerm = '';

  public columns: number = 2;

  public maxDate: number = new Date().getFullYear();

  isLoading = false;

  constructor(private filtersService: FiltersService, private dataService: DataService, private favouritesService: FavouriteService, public loadingController: LoadingController, private changeDetectorRef: ChangeDetectorRef) {
    this.getLocation();
  }

  public ngOnInit() {
    this.originalEvents = this.events;

    this.enableDate ? this.columns +=1 : '';
    this.enableVoivodeship ? this.columns +=1 : '';
    this.inRange ? this.columns +=1 : '';
    this.columns = 12/this.columns;

    this.favouritesService.favouritesChange.subscribe(value => {
      this.originalEvents = value;
      this.initFilters();
    });

    this.filterEvents(this.originalEvents);
    this.initFilters();

    this.categoryFilter = new FormControl();
    this.voivodeshipFilter = new FormControl();
    this.locationFilter = new FormControl();
    this.rangeFilter = new FormControl();
    this.dateFilter = new FormControl();
    this.searchField = new FormControl();

    this.categoryFilter.valueChanges.subscribe((category: string) => {
      this.setCategory(category);
      this.filterEvents(this.originalEvents);
    });

    this.voivodeshipFilter.valueChanges.subscribe((voivodeship: string) => {
      this.setVoivodeship(voivodeship);
      this.filterEvents(this.originalEvents);
    });

    this.locationFilter.valueChanges.subscribe((location: string) => {
      this.setLocation(location);
      this.filterEvents(this.originalEvents);
    });

    this.rangeFilter.valueChanges.subscribe((range: number) => {
      this.present().then(() => {
        !range ? range = 9999999 : '';
        this.setRange(range);
        if (range < 9999999) { // jesli nie wszystkie
          this.getLocation().then(() => {
            this.filterEvents(this.originalEvents);
            this.dismiss();
          }).catch(() => {
            // this.filterEvents(this.originalEvents);
            this.dismiss();
            /*Toast.show({
              text: 'Włącz GPS i spróbuj ponownie'
            });*/
          });
        } else {
          this.filterEvents(this.originalEvents);
          this.dismiss();
        }
      });
    });

    this.dateFilter.valueChanges.subscribe((date: string) => {
      this.setDate(date);

      this.dataService.getEvents(date)
        .subscribe((events: Array<Event>) => {
          this.events = events;
          this.originalEvents = events;
          this.filterEvents(this.originalEvents);
          this.locations = [];
          this.initFilters();
        });
    });

    this.searchField.valueChanges.subscribe((searchingTerm: string) => {
      this.setSearchingTerm(searchingTerm);
      this.filterEvents(this.originalEvents);
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!changes.events.isFirstChange()) {
      this.originalEvents = this.events;
      if (this.enableDate && !this.date || !this.enableDate) {
        this.initFilters();
        this.filterEvents(this.events);
      }
    }
  }

  // do serwisu
  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      // message: 'Wyszukiwanie wydarzeń w pobliżu...',
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then();
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then();
  }


  private initFilters(): void {
    let originalEvents = this.originalEvents;

    if (this.enableDate && !this.date) {
      const todayDate: Date = new Date();
      originalEvents = originalEvents.filter((event: Event) => new Date(event.date_end) <= new Date(todayDate));
    }

    if (originalEvents && originalEvents.length) {
      for (const event of originalEvents) { // todo: lista kategori, miast itp. z api
        const category: string = event.event_type;
        const voivodeship: string = event.voivodeship;
        const location: string = event.location;
        const year: number = parseInt(formatDate(event.date_end, 'yyyy', 'pl'), 10);
        if (this.categories.indexOf(category) === -1) {
          this.categories.push(category);
        }
        if (this.voivodeships.indexOf(voivodeship) === -1) {
          this.voivodeships.push(voivodeship);
        }
        if (this.locations.indexOf(location) === -1) {
          this.locations.push(location);
        }
        if (this.dates.indexOf(year) === -1) {
          this.dates.push(year);
        }
      }

      this.dates = [];

      for (let year: number = this.maxDate - 1; year >= 2014; year--) {
        this.dates.push(year);
      }

      this.categories.sort();
      this.voivodeships.sort();
      this.locations.sort();
    }
  }

  public filterEvents(events: Array<Event>): Array<Event> {
    if (events === null) {
      return [];
    }

    const todayDate: Date = new Date();
    const date = this.date ? this.date + '-12-31' : todayDate;
    let futureEvents = false;

    if (!this.date && !this.enableDate) {
      futureEvents = true;
    }

    const filteredEvents = events.filter((event: Event) => (
        this.filterByCategory(event) &&
        this.filterByLocation(event) &&
        this.filterByVoivodeship(event) &&
        (
          (futureEvents && new Date(event.date_end) >= todayDate) ||
          (!futureEvents && !this.fav && new Date(event.date_end) <= new Date(date)) ||
          (this.fav)
        )
      )
      && this.filterBySearchingTerm(event)
      && this.filterByDistance(event)
    );

    this.eventsFiltered.emit(filteredEvents);
  }

  public calculateDistance(lat1, lon1, lat2, lon2) {
    const radLat1 = Math.PI * lat1 / 180;
    const radLat2 = Math.PI * lat2 / 180;
    const theta = lon1 - lon2;
    const radTheta = Math.PI * theta / 180;
    let dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;

    return dist * 1.609344;
  }

  public async getLocation() {
    const position = await Geolocation.getCurrentPosition();
    this.lat = position.coords.latitude;
    this.long = position.coords.longitude;
  }

  private filterByLocation(event): boolean {
    return event.location.indexOf(this.location) > -1;
  }

  private filterByVoivodeship(event): boolean {
    return event.voivodeship.indexOf(this.voivodeship) > -1;
  }

  private filterByCategory(event): boolean {
    return event.event_type.indexOf(this.category) > -1;
  }

  private filterBySearchingTerm(event): boolean {
    return event.name.toLowerCase().indexOf(this.searchingTerm.toLowerCase()) > -1;
  }

  private filterByDistance(event): boolean {
    return (!this.lat || !this.lat) ||
      (this.calculateDistance(this.lat, this.long, event.lat, event.long) <= this.range);
  }

  public setCategory(category: string): void {
    this.category = category;
  }

  public setVoivodeship(voivodeship: string): void {
    this.voivodeship = voivodeship;
  }

  public setLocation(location: string): void {
    this.location = location;
  }

  public setRange(range: number): void {
    this.range = range;
  }

  public setDate(date: string): void {
    this.date = date;
  }

  public setSearchingTerm(searchingTerm: string): void {
    this.searchingTerm = searchingTerm;
  }
}
