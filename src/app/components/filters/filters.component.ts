import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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

  public filteredEvents;

  public categoryFilter: FormControl;
  public locationFilter: FormControl;
  public dateFilter: FormControl;
  public searchField: FormControl;

  public categories: Array<string> = [];
  public locations: Array<string> = [];
  public dates: Array<number> = [];

  constructor(private filtersService: FiltersService, private dataService: DataService, private favouritesService: FavouriteService) {}

  ngOnInit() {
    this.setFilteredEvents(); // todo: chyba nie bedzie potrzebne jak da sie w home original i filtered
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
          this.setFilteredEvents();
        });
    });

    this.searchField.valueChanges.subscribe((searchingTerm: string) => {
      this.setSearchingTerm(searchingTerm);
      this.setFilteredEvents();
    });
  }

  private initFilters(): void {
    if (this.events) {
      for (const event of this.events) { // todo: lista kategori, miast itp. z api
        const category: string = event.event_type;
        const location: string = event.location;
        const year: number = parseInt(formatDate(event.date_end, 'yyyy', 'pl'), 10);
        if (this.categories.indexOf(category) === -1) { this.categories.push(category); }
        if (this.locations.indexOf(location) === -1) { this.locations.push(location); }
        if (this.dates.indexOf(year) === -1) {
          this.dates.push(year);
        }
      }
      const maxDate: number = Math.max(...this.dates);
      this.dates = [];

      for (let year: number = maxDate; year >= 2014; year--) {
        this.dates.push(year);
      }

      this.categories.sort();
      this.locations.sort();
    }
  }

  private setFilteredEvents(): void {
    this.filtersService.filterEvents(this.events);
  }

  private setCategory(category: string): void {
    this.filtersService.setCategory(category);
  }

  private setLocation(location: string): void {
    this.filtersService.setLocation(location);
  }

  private setDate(date: string): void {
    this.filtersService.setDate(date);
  }

  private setSearchingTerm(searchingTerm: string): void {
    this.filtersService.setSearchingTerm(searchingTerm);
  }

  public getCategories() {
    return this.categories;
  }

  public getFavouritesFlag() {
    return this.favouritesService.favouritesEventsOnly;
  }

  public favouritesFilter(): any {
    this.favouritesService.setFavouritesOnlyFlag();
    this.setFilteredEvents();
  }
}


