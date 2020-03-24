import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { Event } from '@models/event.model';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  public favouritesEventsOnly: boolean = false;
  private readonly STORAGE_KEY: string = 'favoriteEvents';

  private favouritesEvents: Array<number> = [];

  constructor(private storage: Storage) {
    this.getFavoritesEvents()
      .then((favourites: Array<number>) => this.favouritesEvents = favourites);
  }

  public isFavourite(id: number): Boolean {
    if (!this.favouritesEvents) {
      return false;
    }

    for (let i: number = 0; i < this.favouritesEvents.length; i++) {
      if (this.favouritesEvents[i] === id) {
        return true;
      }
    }

    return false;
  }

  public addToFavorites(eventId: number): Promise<any> {
    return this.getFavoritesEvents()
      .then((result: Array<number>) => {
        let favourites: Array<number> = result;
        if (!favourites) {
          favourites = [];
        }
        favourites.push(eventId);
        this.setFavouritesEvents(favourites);

        return this.storage.set(this.STORAGE_KEY, favourites);
      });
  }

  public removeFromFavourites(eventId: number): Promise<any> {
    return this.getFavoritesEvents()
      .then((result: Array<number>) => {
        const index: number = result.indexOf(eventId);
        result.splice(index, 1);
        this.setFavouritesEvents(result);

        return this.storage.set(this.STORAGE_KEY, result);
      });
  }

  public searchFav(events: Array<Event>, search: string): Array<Event> {
    return events.filter((event: Event) => (
      (event.name.toLowerCase()
        .indexOf(search.toLowerCase()) > -1)));
  }

  public setFavouritesOnlyFlag(): void {
    this.favouritesEventsOnly = !this.favouritesEventsOnly;
  }

  public getFavouritesEvents(events: Array<Event>): Array<Event> {
    return events.filter((event: Event) => (
      this.isFavourite(event.id)
    ));
  }

  public getFavouritesOnlyFlag(): Boolean {
    return this.favouritesEventsOnly;
  }

  private setFavouritesEvents(favouritesEvents: Array<number>): void {
    this.favouritesEvents = favouritesEvents;
  }

  private getFavoritesEvents(): Promise<Array<number>> {
    return this.storage.get(this.STORAGE_KEY);
  }
}
