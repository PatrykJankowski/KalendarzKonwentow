import { Injectable } from '@angular/core';
import { Event, EventDetails } from '@models/event.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Plugins } from '@capacitor/core';
import { NetworkService } from '@services/network.service';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly API_URL: string = 'https://softcraft.it/api.php';
  private readonly API_STORAGE_KEY: string = 'KK';

  constructor(private http: HttpClient, private networkService: NetworkService) { }

  public getEvents(year: string = ''): Observable<Event[]> {
    return this.http.get(`${this.API_URL}?year=${year}`)
      .pipe(
        tap((event: Event) => this.setLocalData(`events${year}`, event)),
        catchError(() => {
          return this.networkService.getCurrentNetworkStatus().then(connectionStatus => {
            if (!connectionStatus) {
              return this.getLocalData(`events${year}`);
            }
          });
        })
      )
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


  public filterEvents(events: Array<Event>, category: string, location: string, date: string, search: string): Array<Event> {
    if (events === null) {
      return [];
    }

    const todayDate: Date = new Date();
    let futureEvents: boolean = false;

    if (!date) {
      futureEvents = true;
    }

    return events.filter((event: Event) => (
        event.event_type.indexOf(category) > -1 &&
        event.location.indexOf(location) > -1 &&
        ((futureEvents && new Date(event.date_end) >= todayDate) || (!futureEvents && (event.date_begin.includes(date) || event.date_end.includes(date))))) &&
        (event.name
          .toLowerCase()
          .indexOf(search.toLowerCase()) > -1
        ));
  }


  private async setLocalData(key: string, data: Event): Promise<any> {
    await Storage.set({
      key: `${this.API_STORAGE_KEY}-${key}`, value: JSON.stringify({data})
    });
  }

  private async getLocalData(key: string): Promise<any> {
    const storageData = await Storage.get({ key: `${this.API_STORAGE_KEY}-${key}` });
    return JSON.parse(storageData.value).data;
  }
}
