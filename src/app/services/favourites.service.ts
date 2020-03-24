import { Injectable } from '@angular/core';
import { Event } from '@models/event.model';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  public favouritesEventsOnly = false;
  private readonly STORAGE_KEY: string = 'favoriteEvents';

  private favouritesEvents: Array<number> = [];

  constructor() {
    this.getFavoritesEvents()
      .then((favourites: Array<number>) => this.favouritesEvents = favourites);
  }

  public isFavourite(id: number): boolean {
    if (!this.favouritesEvents) {
      return false;
    }

    for (let i = 0; i < this.favouritesEvents.length; i++) {
      if (this.favouritesEvents[i] === id) {
        return true;
      }
    }

    return false;
  }

  public async addToFavorites(eventId: number): Promise<any> {
    return this.getFavoritesEvents()
      .then((result: Array<number>) => {
        let favourites: Array<number> = result;

        if (!favourites) {
          favourites = [];
        }
        favourites.push(eventId);
        this.setFavouritesEvents(favourites);

        return Storage.set({
          key: this.STORAGE_KEY, value: JSON.stringify(favourites)
        });
      });
  }

  public removeFromFavourites(eventId: number): Promise<any> {
    return this.getFavoritesEvents()
      .then((result: Array<number>) => {
        const index: number = result.indexOf(eventId);
        result.splice(index, 1);
        this.setFavouritesEvents(result);

        return Storage.set({
          key: this.STORAGE_KEY, value: JSON.stringify(result)
        });
      });
  }

  public searchFav(events: Array<Event>, search: string): Array<Event> {
    return events.filter((event: Event) => ((
        event.name.toLowerCase().indexOf(search.toLowerCase()) > -1
    )));
  }

  public setFavouritesOnlyFlag(): void {
    this.favouritesEventsOnly = !this.favouritesEventsOnly;
  }

  public getFavouritesEvents(events: Array<Event>): Array<Event> {
    return events.filter((event: Event) => (
      this.isFavourite(event.id)
    ));
  }

  public getFavouritesOnlyFlag(): boolean {
    return this.favouritesEventsOnly;
  }

  private setFavouritesEvents(favouritesEvents: Array<number>): void {
    this.favouritesEvents = favouritesEvents;
  }

  private async getFavoritesEvents(): Promise<any> {
    const storageData = await Storage.get({key: this.STORAGE_KEY});
    return JSON.parse(storageData.value);
  }
}
