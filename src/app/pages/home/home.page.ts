import { Component, OnInit } from '@angular/core';
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
  public events: Array<Event> = [];
  public result = [];

  // todo: originalevents and filtered, bo laduje za pierwszym razem z filtra od razu        jux??

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService, private filtersService: FiltersService) {}

  public ngOnInit() {
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
