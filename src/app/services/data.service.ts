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
  public responseCache = new Map();

  constructor(private http: HttpClient, private networkService: NetworkService, private storageService: StorageService) {}

  public getEvents(year: string = '', refreshData = true): Observable<any> {

    let obs = this.http.get(`${this.API_URL}?year=${year}`);
    let obs2 = from(this.storageService.getLocalData(`events${year}`));

    return zip(obs, obs2).pipe(
      flatMap((val: [Array<Event>, Array<Event>]) => {
        if(val[0].length === val[1].length) {
          return of(val[1])
        } else {
          return obs.pipe(tap((events: Array<Event>) => {
            this.setImages(events).then((eventsWithImages) => {
              return this.storageService.setLocalData(`events${year}`, eventsWithImages);
            })
          }))
        }
      }),
      catchError(() => {
        return this.storageService.getLocalData(`events${year}`).catch(() => []);
      })
    );
  }

  public getEventDetails(id: number, refreshData = true): Observable<EventDetails[]> {

    let obs = this.http.get(`${this.API_URL}?id=${id}`);

    return from(this.storageService.getLocalData(`event-details-${id}`)).pipe(
      map((val) => {
        if (val) {
          return val;
        }
        return [];
      }),
      flatMap((val) => {
        if (val.length) {
          return of(val);
        } else {
          return obs.pipe(tap((eventDetails: Array<Event>) => {
            this.setImages(eventDetails).then((eventWithImage) => {
              return this.storageService.setLocalData(`event-details-${id}`, eventWithImage);
            })
          }));
        }
      }),
      catchError(() => {
        return this.storageService.getLocalData(`event-details-${id}`).catch(() => []);
      })
    );
  }

  private async convertImageToBase64(url): Promise<any> {
    const response = await fetch(url);
    const blob = await response.blob();
    const result = new Promise((resolve, reject) => {
      if (blob.type === 'text/html') {
        // this.event.image = transparentImage;
        resolve('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      } else {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject;
        reader.readAsDataURL(blob);
      }
    });

    return await result;
  }

  private async setImages(events) {
    for (const event of events) {
      await this.convertImageToBase64(event.image).then((img) => {
        event.image = img;
      })
    }
    return events
  }
}
