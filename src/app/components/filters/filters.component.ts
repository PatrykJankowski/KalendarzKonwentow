import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { LoadingController, ToastController } from '@ionic/angular';

import { Geolocation } from '@capacitor/core';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements OnInit, OnChanges {
  @Input() enableDate = false;
  @Input() enableVoivodeship = false;
  @Input() enableInRange = false;
  @Input() fav = false;
  @Input() events: Array<Event>;

  @Output() eventsFiltered = new EventEmitter();

  public originalEvents: Array<Event>;

  public lat: number;
  public long: number;

  public categories: Array<string> = [];
  public voivodeships: Array<string> = [
    'dolnośląskie',
    'kujawsko-pomorskie',
    'lubelskie',
    'lubuskie',
    'mazowieckie',
    'małopolskie',
    'opolskie',
    'podkarpackie',
    'podlaskie',
    'pomorskie',
    'warmińsko-mazurskie',
    'wielkopolskie',
    'zachodniopomorskie',
    'łódzkie',
    'śląskie',
    'świętokrzyskie'
  ];
  public locations: Array<string> = [];
  public dates: Array<number> = [];

  public _category = '';
  public _voivodeship = '';
  public _location = '';
  public _date = '';
  public _range = 999999;
  public _searchingTerm = '';
  public _noColumns: number;

  public currentYear: number = new Date().getFullYear();

  private isLoading = false;

  public categoryFilter: FormControl;
  public voivodeshipFilter: FormControl;
  public locationFilter: FormControl;
  public dateFilter: FormControl;
  public rangeFilter: FormControl;
  public searchField: FormControl;

  constructor(private dataService: DataService, private favouritesService: FavouriteService, public loadingController: LoadingController, public toastController: ToastController) {}

  public ngOnInit() {
    this.getLocation();

    this.originalEvents = this.events;
    this.noColumns = this.calculateNoColumns();
    this.filterEvents(this.originalEvents);
    this.initFilters();

    if(this.enableVoivodeship) {
      this.voivodeshipFilter = new FormControl();
      this.voivodeshipFilter.valueChanges.subscribe((voivodeship: string) => {
        this.voivodeship = voivodeship;
        this.filterEvents(this.originalEvents);
      });
    }

    if(this.enableInRange) {
      this.rangeFilter = new FormControl();
      this.rangeFilter.valueChanges.subscribe((range: number) => {
        this.present().then(() => {
          if(!range) range = 9999999;
          this.range = range;

          if (range < 9999999) { // jesli nie wszystkie
            this.getLocation().then(() => {
              this.filterEvents(this.originalEvents);
              this.dismiss();
            }).catch(() => {
              this.dismiss();
              this.toastController.create({
                message: '<center>Nie udało się zlokalizować Twojego urządzenia. :(<br>Sprawdź ustawienia GPS i spróbuj ponownie.</center>',
                position: 'middle',
                duration: 5000
              }).then((toastElement:HTMLIonToastElement) => toastElement.present());
            });
          } else {
            this.filterEvents(this.originalEvents);
            this.dismiss();
          }
        });
      });
    }

    if(this.enableDate) {
      this.dateFilter = new FormControl();
      this.dateFilter.valueChanges.subscribe((date: string) => {
        this.date = date;

        this.dataService.getEvents(date)
          .subscribe((events: Array<Event>) => {
            this.originalEvents = events.reverse();
            this.events = this.originalEvents;
            this.filterEvents(this.originalEvents);
            this.locations = [];
            this.initFilters();
          });
      });
    }

    this.categoryFilter = new FormControl();
    this.categoryFilter.valueChanges.subscribe((category: string) => {
      this.category = category;
      this.filterEvents(this.originalEvents);
    });

    this.locationFilter = new FormControl();
    this.locationFilter.valueChanges.subscribe((location: string) => {
      this.location = location;
      this.filterEvents(this.originalEvents);
    });

    this.favouritesService.favouritesChange.subscribe(value => {
      this.originalEvents = value;
      this.initFilters();
    });

    this.searchField = new FormControl();
    this.searchField.valueChanges.subscribe((searchingTerm: string) => {
      this.searchingTerm = searchingTerm;
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
  private async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Wyszukiwanie wydarzeń w pobliżu...',
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then();
        }
      });
    });
  }

  private async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then();
  }

  private initFilters(): void {
    let originalEvents = this.originalEvents;

    // this.locations = [];

    if (this.enableDate && !this.date) {
      const todayDate: Date = new Date();
      originalEvents = originalEvents.filter((event: Event) => new Date(event.date_end) <= new Date(todayDate));
    }

    if (originalEvents && originalEvents.length) {
      for (const event of originalEvents) {
        const category: string = event.event_type;
        const location: string = event.location;
        if (this.categories.indexOf(category) === -1) {
          this.categories.push(category);
        }
        if (this.locations.indexOf(location) === -1) {
          this.locations.push(location);
        }
      }

      for (let year: number = this.currentYear - 1; year >= 2014; year--) {
        this.dates.push(year);
      }

      this.categories.sort();
      this.locations.sort();
    }
  }

  private filterEvents(events: Array<Event>): Array<Event> {
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
        (this.filterByFutureDate(event.date_end, todayDate, futureEvents)) ||
        (this.filterByPastDate(event.date_end, date, !futureEvents && !this.fav)) ||
        (this.fav))
      )
      && this.filterBySearchingTerm(event)
      && this.filterByDistance(event)
    );

    this.eventsFiltered.emit(filteredEvents);
  }

  private calculateDistance(lat1, lon1, lat2, lon2) {
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

  private calculateNoColumns() {
    let noFilters = 2; // min no filters

    if(this.enableDate) noFilters +=1;
    if(this.enableVoivodeship) noFilters +=1;
    if(this.enableInRange) noFilters +=1;

    return 12/noFilters;
  }

  private async getLocation() {
    const position = await Geolocation.getCurrentPosition();
    this.lat = position.coords.latitude;
    this.long = position.coords.longitude;
  }

  private filterByLocation(event): boolean {
    return event.location.indexOf(this._location) > -1;
  }

  private filterByVoivodeship(event): boolean {
    if(!this.enableVoivodeship) return true;
    return event.voivodeship.indexOf(this._voivodeship) > -1;
  }

  private filterByCategory(event): boolean {
    return event.event_type.indexOf(this._category) > -1;
  }

  private filterBySearchingTerm(event): boolean {
    return event.name.toLowerCase().indexOf(this._searchingTerm.toLowerCase()) > -1;
  }

  private filterByDistance(event): boolean {
    if(!this.enableInRange) return true;
    return (event.location === 'Internet') || (!this.lat || !this.lat) || (this.calculateDistance(this.lat, this.long, event.lat, event.long) <= this._range);
  }

  private filterByFutureDate(eventDate, date, filterOn): boolean {
    return filterOn && new Date(eventDate) >= date
  }

  private filterByPastDate(eventDate, date, filterOn): boolean {
    return filterOn && new Date(eventDate) <= new Date(date)
  }

  private set category(category: string) {
    this._category = category;
  }

  private set voivodeship(voivodeship: string) {
    this._voivodeship = voivodeship;
  }

  private set location(location: string) {
    this._location = location;
  }

  private set range(range: number) {
    this._range = range;
  }

  private set date(date: string) {
    this._date = date;
  }

  private set searchingTerm(searchingTerm: string) {
    this._searchingTerm = searchingTerm;
  }

  private set noColumns(noColumns) {
    this._noColumns = noColumns;
  }
}
