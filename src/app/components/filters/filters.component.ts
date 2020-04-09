import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ToastController } from '@ionic/angular';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';
import { LocationService } from '@services/location.service';
import { LoadingService } from '@services/loader.service';

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
  @Output() yearChanged = new EventEmitter();

  public originalEvents: Array<Event>;

  public lat: number;
  public long: number;

  public categories: Array<string> = [];
  public voivodeships: Array<string> = [
    'dolnośląskie',
    'kujawsko-pomorskie',
    'lubelskie',
    'lubuskie',
    'łódzkie',
    'małopolskie',
    'mazowieckie',
    'opolskie',
    'podkarpackie',
    'podlaskie',
    'pomorskie',
    'śląskie',
    'świętokrzyskie',
    'warmińsko-mazurskie',
    'wielkopolskie',
    'zachodniopomorskie'
  ];
  public locations: Array<string> = [];
  public dates: Array<number> = [];

  public _category = '';
  public _voivodeship = '';
  public _location = '';
  public _date = '';
  public _range = 999999;
  // public _searchingTerm = '';
  public _noColumns: number;

  public currentYear: number = new Date().getFullYear();

  public categoryFilter: FormControl;
  public voivodeshipFilter: FormControl;
  public locationFilter: FormControl;
  public dateFilter: FormControl;
  public rangeFilter: FormControl;
  // public searchField: FormControl;

  constructor(private dataService: DataService, private favouritesService: FavouriteService, public loadingService: LoadingService, public toastController: ToastController, private locationService: LocationService) {}

  public ngOnInit() {
    this.locationService.getLocation().then((coordinates) => {
      this.lat = coordinates[0];
      this.long = coordinates[1];
    });

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
        this.loadingService.present().then(() => {
          if(!range) range = 9999999;
          this.range = range;
          if (range < 9999999) { // jesli nie wszystkie
            this.locationService.getLocation().then((coordinates) => {
              this.lat = coordinates[0];
              this.long = coordinates[1];
              this.filterEvents(this.originalEvents);
              this.loadingService.dismiss();
            }).catch(() => {
              this.loadingService.dismiss();
              this.toastController.create({
                message: '<center>Nie udało się zlokalizować Twojego urządzenia.<br>Sprawdź ustawienia GPS i spróbuj ponownie.</center>',
                position: 'middle',
                duration: 5000
              }).then((toastElement:HTMLIonToastElement) => toastElement.present());
            });
          } else {
            this.filterEvents(this.originalEvents);
            this.loadingService.dismiss();
          }
        });
      });
    }

    if(this.enableDate) {
      this.dateFilter = new FormControl();
      this.dateFilter.valueChanges.subscribe((date: string) => {
        this.date = date;
        this.locations = [];
        this.yearChanged.emit(this._date);
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

    /*this.searchField = new FormControl();
    this.searchField.valueChanges.subscribe((searchingTerm: string) => {
      this.searchingTerm = searchingTerm;
      this.filterEvents(this.originalEvents);
    });*/
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

  private initFilters(): void {
    let originalEvents = this.originalEvents;

    // this.locations = [];

    if (this.enableDate && !this.date) {
      const todayDate: Date = new Date();
      originalEvents = originalEvents.filter((event: Event) => new Date(event.date_end) <= new Date(todayDate));

      this.dates = [];
      for (let year: number = this.currentYear - 1; year >= 2014; year--) {
        this.dates.push(year);
      }
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

      this.categories.sort();
      this.locations.sort();
    }
  }

  private filterEvents(events: Array<Event>): Array<Event> {
    if (events === null) {
      return [];
    }

    const todayDate: Date = new Date();
    const date = this._date ? this._date + '-12-31' : todayDate;

    let futureEvents = false;
    if (!this._date && !this.enableDate) {
      futureEvents = true;
    }

    const filteredEvents = events.filter((event: Event) => (
      this.filterByCategory(event) &&
      this.filterByLocation(event) &&
      this.filterByVoivodeship(event) &&
      this.filterByDistance(event) &&
      // this.filterBySearchingTerm(event) &&
      (
        this.filterByFutureDate(event.date_end, todayDate, futureEvents) ||
        this.filterByPastDate(event.date_end, date, !futureEvents && !this.fav) ||
        this.fav
      ))
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

  private filterByLocation(event): boolean {
    return !this._location || event.location === this._location;
  }

  private filterByVoivodeship(event): boolean {
    if(!this.enableVoivodeship) return true;
    return !this._voivodeship || event.voivodeship === this._voivodeship;
  }

  private filterByCategory(event): boolean {
    return !this._category || event.event_type === this._category;
  }

  /*private filterBySearchingTerm(event): boolean {
    return event.name.toLowerCase().indexOf(this._searchingTerm.toLowerCase()) > -1;
  }*/

  private filterByDistance(event): boolean {
    if(!this.enableInRange) return true;
    return event.location === 'Internet' ||
           (!this.lat || !this.lat) ||
           this.calculateDistance(this.lat, this.long, event.lat, event.long) <= this._range;
  }

  private filterByFutureDate(eventDate, date, filterOn): boolean {
    return filterOn && new Date(eventDate).setHours(0,0,0,0) >= date.setHours(0,0,0,0)
  }

  private filterByPastDate(eventDate, date, filterOn): boolean {
    return filterOn && new Date(eventDate).setHours(0,0,0,0) < new Date(date).setHours(0,0,0,0)
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

  /*private set searchingTerm(searchingTerm: string) {
    this._searchingTerm = searchingTerm;
  }*/

  private set noColumns(noColumns) {
    this._noColumns = noColumns;
  }
}
