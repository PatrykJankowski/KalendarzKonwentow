import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Network } from '@capacitor/core';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';
import { FiltersService } from '@services/filters.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @Input() filteredEvents: Array<Event> = [];

  public events: Array<Event> = [];

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService, private filtersService: FiltersService) {}

  public ngOnInit() {
    this.events = this.activatedRoute.snapshot.data.events;

    Network.addListener('networkStatusChange', (status) => {
      if(status.connected) {
        this.dataService.getEvents('', true).subscribe((events: Array<Event>) => {
          this.events = events;
          console.log('online')
        });
      }
    })
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

  public trackByFn(index, item) {
    return item.id;
  }

  public eventsFiltered(event) {
    console.log('1111111111111111111')
    this.filteredEvents = event;
  }

  public refresh(ev) {
    this.dataService.getEvents('', true).subscribe((events: Array<Event>) => {
      this.events = events;
      ev.detail.complete();
    });
  }

/*  public refresh(ev) {
      this.dataService.getEvents('', true).subscribe((s) => {
        this.events = [{id: 1107,
        name: "IV Pałacowy Uniwersytet Fantastyczny",
        date_begin: "2020-06-01",
        date_end: "2020-07-01",
        event_type: "Fantastyka",
        image: "https://www.konwenty-poludniowe.pl/images/joodb/db1/img1107.jpg",
        location: "Brzeg"
        }];
      console.log(this.events); ev.detail.complete();});
  }*/
}
