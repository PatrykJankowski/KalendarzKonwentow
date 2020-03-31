import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Event, EventDetails } from '@models/event.model';
import { NetworkService } from '@services/network.service';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly API_URL: string = 'https://konwenty-poludniowe.pl/api.php';
  private readonly API_STORAGE_KEY: string = 'KK';
  public responseCache = new Map();

  constructor(private http: HttpClient, private networkService: NetworkService) {}

  public getEvents(year: string = '', refreshData = true): Observable<Event[]> {
    if (!refreshData) {
      const eventsFromCache = this.responseCache.get(URL);
      if (eventsFromCache) {
        return of(eventsFromCache);
      }
    }

    return this.http.get(`${this.API_URL}?year=${year}`)
      .pipe(
        tap((event: Event) => {
          this.setLocalData(`events${year}`, event);
          this.responseCache.set(URL, event)
        }),
        catchError(() => {
          return this.networkService.getCurrentNetworkStatus().then(connectionStatus => {
            if (!connectionStatus) {
              return this.getLocalData(`events${year}`).catch(() => []);
            }
          });
        })
      );
  }

  public getEventDetails(id: number): Observable<EventDetails[]> {
    return this.http.get(`${this.API_URL}?id=${id}`)
      .pipe(
        tap((eventDetails: Event) => this.setLocalData(`event-details-${id}`, eventDetails)),
        catchError(() => {
          return this.networkService.getCurrentNetworkStatus().then(connectionStatus => {
            if (!connectionStatus) {
              return this.getLocalData(`event-details-${id}`);
            }
          });
        })
      )
  }

  private async setLocalData(key: string, data: Event): Promise<any> {
    try {
      await Storage.set({
        key: `${this.API_STORAGE_KEY}-${key}`, value: JSON.stringify({data})
      });
    } catch(err) {
      return err;
    }
  }

  public async getLocalData(key: string): Promise<any> {
    try {
      const storageData = await Storage.get({ key: `${this.API_STORAGE_KEY}-${key}` });
      return JSON.parse(storageData.value).data;
    } catch(err) {
      return [];
    }
  }
}
