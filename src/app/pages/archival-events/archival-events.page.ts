import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Network } from '@capacitor/core';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';
import { FiltersService } from '@services/filters.service';

@Component({
  selector: 'app-archival-events',
  templateUrl: './archival-events.page.html',
  styleUrls: ['./archival-events.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchivalEventsPage implements OnInit {
  @Input() filteredEvents: Array<Event> = [];

  public events: Array<Event> = [];

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

  public trackByFn(index, item) {
    return item.id;
  }

  public eventsFiltered(event) {
    this.filteredEvents = event;
  }

  public refresh(ev) {
    this.dataService.getEvents('', true).subscribe((events: Array<Event>) => {
      this.events = events;
      ev.detail.complete();
    });
  }
}
