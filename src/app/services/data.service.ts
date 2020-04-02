import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Event, EventDetails } from '@models/event.model';
import { NetworkService } from '@services/network.service';
import { StorageService } from '@services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly API_URL: string = 'https://konwenty-poludniowe.pl/api.php';
  public responseCache = new Map();

  constructor(private http: HttpClient, private networkService: NetworkService, private storageService: StorageService) {}

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
          this.storageService.setLocalData(`events${year}`, event);
          this.responseCache.set(URL, event)
        }),
        catchError(() => {
          return this.networkService.getCurrentNetworkStatus().then(connectionStatus => {
            if (!connectionStatus) {
              return this.storageService.getLocalData(`events${year}`).catch(() => []);
            }
          });
        })
      );
  }

  public getEventDetails(id: number): Observable<EventDetails[]> {
    return this.http.get(`${this.API_URL}?id=${id}`)
      .pipe(
        tap((eventDetails: Event) => this.storageService.setLocalData(`event-details-${id}`, eventDetails)),
        catchError(() => {
          return this.networkService.getCurrentNetworkStatus().then(connectionStatus => {
            if (!connectionStatus) {
              return this.storageService.getLocalData(`event-details-${id}`);
            }
          });
        })
      )
  }
}
