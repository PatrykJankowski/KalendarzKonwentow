import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { from, Observable, of, zip } from 'rxjs';
import { catchError, flatMap, map, tap } from 'rxjs/operators';

import { Event, EventDetails } from '@models/event.model';
import { NetworkService } from '@services/network.service';
import { StorageService } from '@services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly API_URL: string = 'https://konwenty-poludniowe.pl/api.php';

  constructor(private http: HttpClient, private networkService: NetworkService, private storageService: StorageService) {}

  public getEvents(year: string = ''): Observable<any> {
    const apiRequest = this.http.get(`${this.API_URL}?year=${year}`);
    const storageRequest = from(this.storageService.getLocalData(`events${year}`));

    return zip(apiRequest, storageRequest).pipe(
      flatMap((eventsArray: [Array<Event>, Array<Event>]) => {
        if(eventsArray[0].length === eventsArray[1].length) {
          return of(eventsArray[1])
        } else {
          return apiRequest.pipe(
            tap((events: Array<Event>) => {
              this.storageService.setLocalData(`events${year}`, events);
              this.storageService.setImages(events);
            })
          )
        }
      }),
      catchError(() => {
        return this.storageService.getLocalData(`events${year}`);
      })
    );
  }

  public getEventDetails(id: number): Observable<EventDetails[]> {
    const apiRequest = this.http.get(`${this.API_URL}?id=${id}`);

    return from(this.storageService.getLocalData(`event-details-${id}`)).pipe(
      map((eventDetailsFromStorage) => {
        if (eventDetailsFromStorage) return eventDetailsFromStorage;
        return [];
      }),
      flatMap((eventDetailsFromStorage) => {
        if (eventDetailsFromStorage.length) {
          return of(eventDetailsFromStorage);
        } else {
          return apiRequest.pipe(
            tap((eventDetails: Event) => {
              this.storageService.setLocalData(`event-details-${id}`, eventDetails);
              this.storageService.setImages(eventDetails);
            })
          );
        }
      }),
      catchError(() => {
        return this.storageService.getLocalData(`event-details-${id}`);
      })
    );
  }
}
