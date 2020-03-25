import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Network } from '@capacitor/core';
import { Plugins } from '@capacitor/core';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';
import { FiltersService } from '@services/filters.service';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

const { SplashScreen } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public events: Array<Event> = [];
  public result = [];

  // todo: originalevents and filtered, bo laduje za pierwszym razem z filtra od razu        jux??

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService, private filtersService: FiltersService,
              private nativeGeocoder: NativeGeocoder) {}

  public ngOnInit() {
    //SplashScreen.hide();

    this.events = this.activatedRoute.snapshot.data.events;

    Network.addListener('networkStatusChange', (status) => {
      if(status.connected) {
        this.dataService.getEvents(this.filtersService.getDate())
          .subscribe((events: Array<Event>) => {
            this.filtersService.filterEvents(events);
            this.filtersService.setFilteredEvents(this.filtersService.filteredEvents);
          });
      }
    });
  }



  public range() {
    let cities = [];
    let coords = [];


    for(let event of this.events) {
      if (cities.indexOf(event.location) === -1) { cities.push(event.location); }
    }


    var rad = function(x) {
      return x * Math.PI / 180;
    };

    var getDistance = function(p1, p2) {
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = rad(p2[0] - p1[0]);
      var dLong = rad(p2[1] - p1[1]);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(rad(p1[0])) * Math.cos(rad(p2[0])) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d; // returns the distance in meter
    };

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    };


    let lat;
    let long;

    this.nativeGeocoder.forwardGeocode('Warszawa', options)
        .then((result: NativeGeocoderResult[]) => {
          console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude);
          lat = result[0].latitude;
          long = result[0].longitude
        })
        .catch((error: any) => console.log(error));


    for(let city of cities) {
      this.nativeGeocoder.forwardGeocode(city, options)
          .then((result: NativeGeocoderResult[]) => {
            console.log(getDistance([lat, long], [result[0].latitude, result[0].longitude]));
            if (getDistance([lat, long], [result[0].latitude, result[0].longitude]) < 100000) {
              console.log(city);
              this.result.push(city);
            }
          })
          .catch((error: any) => console.log(error));
    }

    return this.result;
  }


  public ionViewWillEnter(): void {
    // Remove dropdown arrow; hope for better solution in future Ionic version
    const ionSelects: NodeListOf<HTMLIonSelectElement> = document.querySelectorAll('ion-select');
    ionSelects.forEach((select: HTMLIonSelectElement) => {
      select.shadowRoot.querySelectorAll('.select-icon')
        .forEach((element: HTMLElement) => {
          element.setAttribute('style', 'display: none');
        });
    });
  }


  public getEvents(): Array<Event> {
    return this.filtersService.getFilteredEvents();
  }

  public loadDefaultImage(event): void {
    event.target.src = '/assets/no-image.jpg';
  }


  public refresh(ev) {
    setTimeout(() => {
      this.getEvents();
      ev.detail.complete();
    }, 1000);
  }
}


















/*  public async takePhoto() {
    console.log(this.events[0].image);


    const date = new Date(),
        time = date.getTime(),
        fileName = time + '.jpg';

    await Filesystem.writeFile({
      data: this.events[0].image,
      path: fileName,
      directory: FilesystemDirectory.Data
    });

    const finalPhotoUri = await Filesystem.getUri({
      directory: FilesystemDirectory.Data,
      path: fileName
    });

    const photoPath = Capacitor.convertFileSrc(finalPhotoUri.uri);
    console.log(photoPath);
    this.photo = photoPath;
  }*/
