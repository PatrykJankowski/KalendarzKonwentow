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
    this.favouritesChange.subscribe((events: Array<Event>) => {
      this.favouritesEvents = events
    })
  }

  public isFavourite(id: number): boolean {
    if (!this.favouritesEvents) return false;
    for (let i = 0; i < this.favouritesEvents.length; i++) {
      if (this.favouritesEvents[i].id === id) return true;
    }
    return false;
  }

  public async addToFavorites(event: Event): Promise<any> {
    let favouritesEvents = await this.getFavoritesEvents();
    if (!favouritesEvents) favouritesEvents = [];
    favouritesEvents.push(event);
    this.setFavouritesEvents(favouritesEvents);
    return await Storage.set({
      key: this.STORAGE_KEY, value: JSON.stringify(favouritesEvents)
    });
  }

  public async removeFromFavourites(event: Event): Promise<any> {
    const favouritesEvents = await this.getFavoritesEvents();
    const index = favouritesEvents.findIndex(x => x.id === event.id);
    favouritesEvents.splice(index, 1);
    this.setFavouritesEvents(favouritesEvents);
    return await Storage.set({
      key: this.STORAGE_KEY, value: JSON.stringify(favouritesEvents)
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
