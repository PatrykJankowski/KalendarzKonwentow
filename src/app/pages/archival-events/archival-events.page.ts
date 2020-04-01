import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Network, Plugins } from '@capacitor/core';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';
import { NetworkService } from '@services/network.service';

const {Storage} = Plugins;

@Component({
  selector: 'app-archival-events',
  templateUrl: './archival-events.page.html',
  styleUrls: ['./archival-events.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchivalEventsPage implements OnInit {
  @Input() filteredEvents: Array<Event> = [];

  public events: Array<Event> = [];
  public _networkStatus: boolean = true;

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService, private networkService: NetworkService, private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit() {
    this.events = this.activatedRoute.snapshot.data.events.reverse();
    this.networkService.getCurrentNetworkStatus().then((networkStatus: boolean) => {
      this.networkStatus = networkStatus;
      this.changeDetectorRef.markForCheck();
    });

    Network.addListener('networkStatusChange', (networkStatus) => {
      this.networkStatus = networkStatus.connected;
      if (networkStatus.connected) this.loadData();
      this.changeDetectorRef.detectChanges();
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

  private loadData() {
    if (!this.events.length) {
      this.dataService.getEvents('', true).subscribe((events: Array<Event>) => {
        if (this.events.length !== events.length) {
          // Storage.clear().then(() => { //czysci ulubione !!!!!!!!!!!!!!!
            this.events = events.reverse();
            this.changeDetectorRef.markForCheck();
          // });
        }
      });
    }
  }

  private set networkStatus(networkStatus: boolean) {
    this._networkStatus = networkStatus;
  }

  public trackByFn(index, item) {
    return item.id;
  }

  public eventsFiltered(event) {
    this.filteredEvents = event;
  }

  public refresh(ev) {
    this.dataService.getEvents('', true).subscribe((events: Array<Event>) => {
      this.events = events.reverse();
      this.changeDetectorRef.markForCheck();
      ev.detail.complete();
    });
  }
}
