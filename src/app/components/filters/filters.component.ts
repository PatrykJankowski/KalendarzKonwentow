import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';
import { FiltersService } from '@services/filters.service';

import { Geolocation} from '@capacitor/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  @Input() events: Array<Event>;
  @Output() eventsFiltered = new EventEmitter();

  @Input() enableDate: boolean = false;
  @Input() fav: boolean = false;
  @Input() inRange: boolean = false;

  public originalEvents: Array<Event>;

  public categoryFilter: FormControl;
  public locationFilter: FormControl;
  public dateFilter: FormControl;
  public rangeFilter: FormControl;
  public searchField: FormControl;

  public lat;
  public long;

  public categories: Array<string> = [];
  public locations: Array<string> = [];
  public dates: Array<number> = [];

  public category = '';
  public location = '';
  public date = '';
  public range = 999999;
  public searchingTerm = '';

  public maxDate: number = new Date().getFullYear();

  constructor(private filtersService: FiltersService, private dataService: DataService, private favouritesService: FavouriteService) {
    this.getLocation();
  }

  ngOnInit() {
    this.originalEvents = this.events;

    this.favouritesService.favouritesChange.subscribe(value => {
      this.originalEvents = value;
      this.initFilters()
    });

    this.filterEvents(this.originalEvents);
    this.initFilters();

    this.categoryFilter = new FormControl();
    this.locationFilter = new FormControl();
    this.rangeFilter = new FormControl();
    this.dateFilter = new FormControl();
    this.searchField = new FormControl();

    this.categoryFilter.valueChanges.subscribe((category: string) => {
      this.setCategory(category);
      this.setFilteredEvents();
    });

    this.locationFilter.valueChanges.subscribe((location: string) => {
      this.setLocation(location);
      this.setFilteredEvents();
    });

    this.rangeFilter.valueChanges.subscribe((range: number) => {
      !range ? range = 9999999 : '';
      this.setRange(range);

      this.getLocation().then(() => this.setFilteredEvents()).catch(() => this.setFilteredEvents());

    });

    this.dateFilter.valueChanges.subscribe((date: string) => {
      this.setDate(date);

      this.dataService.getEvents(date)
        .subscribe((events: Array<Event>) => {
          this.events = events;
          this.originalEvents = events;
          this.setFilteredEvents();
        });
    });

    this.searchField.valueChanges.subscribe((searchingTerm: string) => {
      this.setSearchingTerm(searchingTerm);
      this.setFilteredEvents();
    });
  }



  public distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
  }

  public async getLocation() {
    const position = await Geolocation.getCurrentPosition();
    this.lat = position.coords.latitude;
    this.long = position.coords.longitude;
  }


  ngOnChanges() {
    this.originalEvents = this.events;

    if (this.enableDate && !this.date || !this.enableDate) {
      this.initFilters();
      this.filterEvents(this.events)
    }
  }

  private initFilters(): void {
    //this.categories = [];
    //this.locations = [];

    if (this.originalEvents) {
      for (const event of this.originalEvents) { // todo: lista kategori, miast itp. z api
        const category: string = event.event_type;
        const location: string = event.location;
        const year: number = parseInt(formatDate(event.date_end, 'yyyy', 'pl'), 10);
        if (this.categories.indexOf(category) === -1) { this.categories.push(category); }
        if (this.locations.indexOf(location) === -1) { this.locations.push(location); }
        if (this.dates.indexOf(year) === -1) {
          this.dates.push(year);
        }
      }

      this.dates = [];

      for (let year: number = this.maxDate - 1; year >= 2014; year--) {
        this.dates.push(year);
      }

      this.categories.sort();
      this.locations.sort();
    }
  }

  public getCategories() {
    return this.categories;
  }

  public setCategory(category: string): void {
    this.category = category;
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

  public setFilteredEvents(): void {
    this.filterEvents(this.originalEvents);
  }

  public filterEvents(events: Array<Event>, fav = false): Array<Event> {
    if (events === null) {
      return [];
    }

    const todayDate: Date = new Date();
    let date = this.date ? this.date + '-12-31' : this.maxDate + '-12-31';
    let futureEvents = false;

    if (!this.date && !this.enableDate) {
      futureEvents = true;
    }

    let filteredEvents = events.filter((event: Event) => (
      event.event_type.indexOf(this.category) > -1 &&
      event.location.indexOf(this.location) > -1 &&
        (
          (futureEvents && new Date(event.date_end) >= todayDate) ||
          (!futureEvents && !this.fav && new Date(event.date_end) <= new Date(date)) ||
          (this.fav)
        )
      )
      && (event.name.toLowerCase().indexOf(this.searchingTerm.toLowerCase()) > -1)
      && ((!this.lat || !this.lat) || (this.distance(this.lat, this.long, event.lat, event.long, "K") <= this.range))
    );

    this.eventsFiltered.emit(filteredEvents);
  }
}
