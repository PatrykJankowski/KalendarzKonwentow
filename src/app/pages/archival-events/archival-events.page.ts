import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Network, NetworkStatus } from '@capacitor/core';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';
import { LoadingService } from '@services/loader.service';
import { NetworkService } from '@services/network.service';
import { StorageService } from '@services/storage.service';

@Component({
  selector: 'app-archival-events',
  templateUrl: './archival-events.page.html',
  styleUrls: ['./archival-events.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchivalEventsPage implements OnInit {
  @Input() _filteredEvents: Array<Event> = [];
  @Input() _year: string;

  public _events: Array<Event> = [];
  public _networkStatus: boolean = true;

  constructor(private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private dataService: DataService,
              private networkService: NetworkService,
              private storageService: StorageService,
              private favouritesService: FavouriteService,
              private loadingService: LoadingService) {}

  public ngOnInit() {
    this.events = this.activatedRoute.snapshot.data.events.reverse();
    this.networkService.getCurrentNetworkStatus().then((networkStatus: boolean) => {
      this.networkStatus = networkStatus;
      this.changeDetectorRef.markForCheck();
    });

    Network.addListener('networkStatusChange', (networkStatus: NetworkStatus) => {
      this.networkStatus = networkStatus.connected;
      if (networkStatus.connected) this.loadData(false, !!this._events.length);
      this.changeDetectorRef.detectChanges();
    });

    this.favouritesService.favouritesChange.subscribe(events => {
      this.changeDetectorRef.markForCheck();
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

  private async loadData(clearStorage: boolean, isEventsListEmpty: boolean) {
    if(isEventsListEmpty) {
      this.dataService.getEvents(this._year, true).subscribe((events: Array<Event>) => {
        // if (this.events.length !== events.length) {
          this.events = events.reverse();
          this.changeDetectorRef.markForCheck();
        // }
      });
    }
  }

  public trackByFn(index, item) {
    return item.id;
  }

  public set filteredEvents(event) {
    this._filteredEvents = event;
  }

  public set year(event) {
    this.dataService.getEvents(event)
      .subscribe((events: Array<Event>) => {
        this.events = events.reverse();
        this.changeDetectorRef.markForCheck();
      });
    this._year = event;
  }

  private set events(events: Array<Event>) {
    this._events = events
  }

  private set networkStatus(networkStatus: boolean) {
    this._networkStatus = networkStatus
  }

  public async refresh(ev) {
    if (this._networkStatus) await this.loadData(true, true);
    ev.detail.complete();
  }
}
