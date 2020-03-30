import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { Subject } from 'rxjs';

import { Event } from '@models/event.model';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  private readonly STORAGE_KEY: string = 'favoriteEvents';

  public favouritesEvents: Array<Event> = [];
  public favouritesChange: Subject<Array<Event>> = new Subject<Array<Event>>();

  constructor() {
    this.getFavoritesEvents().then((favourites: Array<Event>) => this.favouritesEvents = favourites);
      this.favouritesChange.subscribe((events) => {
          this.favouritesEvents = events
      })
  }

  public isFavourite(id: number): boolean {
    if (!this.favouritesEvents) {
      return false;
    }

    for (let i = 0; i < this.favouritesEvents.length; i++) {
      if (this.favouritesEvents[i].id === id) {
        return true;
      }
    }

    return false;
  }

  public async addToFavorites(event: Event): Promise<any> {
    return this.getFavoritesEvents()
      .then((result: Array<Event>) => {
        let favourites: Array<Event> = result;

        if (!favourites) {
          favourites = [];
        }

        favourites.push(event);
        this.setFavouritesEvents(favourites);

        return Storage.set({
          key: this.STORAGE_KEY, value: JSON.stringify(favourites)
        });
      });
  }

  public removeFromFavourites(event: Event): Promise<any> {
    return this.getFavoritesEvents()
      .then((result: Array<Event>) => {
        const index = result.findIndex(x => x.id === event.id);

        result.splice(index, 1);

        this.setFavouritesEvents(result);

        return Storage.set({
          key: this.STORAGE_KEY, value: JSON.stringify(result)
        });
      });
  }

  public getFavouritesEvents(events: Array<Event>): Array<Event> {
    return events.filter((event: Event) => (
      this.isFavourite(event.id)
    ));
  }

  private setFavouritesEvents(favouritesEvents: Array<Event>): void {
    this.favouritesEvents = favouritesEvents;
      this.favouritesChange.next(this.favouritesEvents)
  }

  public async getFavoritesEvents(): Promise<any> {
    const storageData = await Storage.get({key: this.STORAGE_KEY});
    return JSON.parse(storageData.value);
  }
}
