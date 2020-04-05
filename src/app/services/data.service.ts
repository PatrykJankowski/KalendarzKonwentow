import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { from, Observable, of } from 'rxjs';
import { catchError, flatMap, isEmpty, map, mergeMap, tap } from 'rxjs/operators';

import { Event, EventDetails } from '@models/event.model';
import { NetworkService } from '@services/network.service';
import { StorageService } from '@services/storage.service';
const { Storage } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly API_URL: string = 'https://konwenty-poludniowe.pl/api.php';
  public responseCache = new Map();

  constructor(private http: HttpClient, private networkService: NetworkService, private storageService: StorageService) {}

  private async convertImageToBase64(url): Promise<any> {
    const response = await fetch(url);
    const blob = await response.blob();
    const result = new Promise((resolve, reject) => {
      if (blob.type === 'text/html') {
        // this.event.image = transparentImage;
        resolve('');
      } else {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject;
        reader.readAsDataURL(blob);
      }
    });

    return await result;
  }

  private async storageData(year) {
    const storageData = await this.storageService.getLocalData(`events${year}`);
    return storageData.length
  }



  private value<T>(key:string, value:T):Observable<any>{
    return from(Storage.set({key, value: JSON.stringify({value})}))
      .pipe(map(val => val));
  }


  
  public getEvents(year: string = '', refreshData = true): Observable<any> {
    if (!refreshData) {
      const eventsFromCache = from(this.storageService.getLocalData(`events${year}`));
      if (eventsFromCache) {
        return eventsFromCache;
      }
    }

    let obs = this.http.get(`${this.API_URL}?year=${year}`);

    return from(this.storageService.getLocalData(`events${year}`)).pipe(
      map((events) => {
        if(events) {
          return events
        }
        return []
      }),
      flatMap((data) => {

        console.log('data', data)

        if (data.length) {console.log('22222222')
          return of(data);
        } else {
          console.log('333333')
          return obs.pipe(tap((x: Array<Event>) => {

            console.log(x.length, data.length)

              this.setImages(x).then((eventsWithImages) => {
                return this.storageService.setLocalData(`events${year}`, eventsWithImages);
              })


          }));
        }
      })
    );

/*    return this.http.get(`${this.API_URL}?year=${year}`)
      .pipe(
        tap((events: Array<Event>) => {
          this.setImages(events).then((eventsWithImages) => {
            return this.storageService.setLocalData(`events${year}`, eventsWithImages);
          })
        }),
        catchError(() => {
          return this.networkService.getCurrentNetworkStatus().then(connectionStatus => {
            if (!connectionStatus) {
              return this.storageService.getLocalData(`events${year}`).catch(() => []);
            }
          });
        })
      );*/
  }

  private async setImages(events) {
    for (const event of events) {
      await this.convertImageToBase64(event.image).then((img) => {
        event.image = img;
      })
    }
    return events
  }

  public getEventDetails(id: number, refreshData = true): Observable<EventDetails[]> {
    if (!refreshData) {
      const eventsFromCache = from(this.storageService.getLocalData(`event-details-${id}`));
      if (eventsFromCache) {
        console.log(eventsFromCache)
        return eventsFromCache;
      }
    }

    return this.http.get(`${this.API_URL}?id=${id}`)
      .pipe(
        tap((eventDetails: Event) => {
          this.setImages(eventDetails).then((eventWithImage) => {
            return this.storageService.setLocalData(`event-details-${id}`, eventWithImage)
          })
        }),
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
