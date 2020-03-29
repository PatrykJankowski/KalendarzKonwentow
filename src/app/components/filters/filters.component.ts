import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';
import { FiltersService } from '@services/filters.service';

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

  public originalEvents: Array<Event>;

  public categoryFilter: FormControl;
  public locationFilter: FormControl;
  public dateFilter: FormControl;
  public searchField: FormControl;

  public categories: Array<string> = [];
  public locations: Array<string> = [];
  public dates: Array<number> = [];

  public category = '';
  public location = '';
  public date = '';
  public searchingTerm = '';

  public maxDate: number = new Date().getFullYear();

  constructor(private filtersService: FiltersService, private dataService: DataService, private favouritesService: FavouriteService) {}

  ngOnInit() {
    console.log('filters:', this.events);
    this.originalEvents = this.events;

    this.favouritesService.favouritesChange.subscribe(value => {
      console.log('filters change: ', value);
      this.originalEvents = value;
      this.initFilters()
    });

    this.filterEvents(this.originalEvents);
    this.initFilters();

    this.categoryFilter = new FormControl();
    this.locationFilter = new FormControl();
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

    this.dateFilter.valueChanges.subscribe((date: string) => {
      this.setDate(date);

      this.dataService.getEvents(date)
        .subscribe((events: Array<Event>) => {
          this.events = events;
          this.originalEvents = this.events;
          this.setFilteredEvents();
        });
    });

    this.searchField.valueChanges.subscribe((searchingTerm: string) => {
      this.setSearchingTerm(searchingTerm);
      this.setFilteredEvents();
    });
  }

  ngOnChanges() {
    this.originalEvents = this.events;
    console.log(this.events);
    this.initFilters();
    this.filterEvents(this.events)
  }

  private initFilters(): void {
    this.categories = [];
    this.locations = [];

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

console.log('in filtered pre', events);

    const todayDate: Date = new Date();
    let futureEvents = false;

    if (!this.date && !this.enableDate) {
      futureEvents = true;
    }

    this.events = events.filter((event: Event) => (
      event.event_type.indexOf(this.category) > -1 &&
      event.location.indexOf(this.location) > -1 &&
        (
          (futureEvents && new Date(event.date_end) >= todayDate) ||
          (!futureEvents && !this.fav && new Date(event.date_end) < todayDate) ||
          (this.fav)
        )
      )
      && (event.name.toLowerCase().indexOf(this.searchingTerm.toLowerCase()) > -1)
    );
    console.log('in filtered', this.events);
    this.eventsFiltered.emit(this.events);
  }
}
