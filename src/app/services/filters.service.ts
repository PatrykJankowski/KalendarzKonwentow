import { Injectable } from '@angular/core';

import { Event } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';


@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  public categories: Array<string> = [];
  public locations: Array<string> = [];
  public dates: Array<number> = [];

  public category = '';
  public location = '';
  public date = '';
  public searchingTerm = '';

  public filteredEvents: Array<Event>;

  constructor(private favouritesService: FavouriteService) {}

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

  public setFilteredEvents(filteredEvents): void {
    this.filteredEvents = filteredEvents ;
  }

  public getDate() {
    return this.date;
  }

  public getFilteredEvents(): Array<Event> {
    return this.filteredEvents;
  }

  public filterEvents(events: Array<Event>): Array<Event> {
    if (events === null) {
      return [];
    }

    const todayDate: Date = new Date();
    let futureEvents = false;

    if (!this.date) {
      futureEvents = true;
    }

    this.filteredEvents = events.filter((event: Event) => (
          event.event_type.indexOf(this.category) > -1 &&
          event.location.indexOf(this.location) > -1 &&
          (
              (futureEvents && new Date(event.date_end) >= todayDate) ||
              (!futureEvents && (event.date_begin.includes(this.date) || event.date_end.includes(this.date)))
          )
        )
        && (event.name.toLowerCase().indexOf(this.searchingTerm.toLowerCase()) > -1)
        /*&& (!this.favouritesService.getFavouritesOnlyFlag() || this.favouritesService.isFavourite(event.id))*/
    );
  }
}
