import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Network, NetworkStatus } from '@capacitor/core';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';
import { NetworkService } from '@services/network.service';
import { StorageService } from '@services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit {
  @Input() _filteredEvents: Array<Event> = [];

  public _events: Array<Event> = [];
  public _networkStatus: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private networkService: NetworkService,
    private storageService: StorageService,
    private changeDetectorRef: ChangeDetectorRef,
    private favouritesService: FavouriteService) {}

  public ngOnInit() {
    this.events = this.activatedRoute.snapshot.data.events;
    console.log('asd', this._events)

    this.networkService.getCurrentNetworkStatus().then((networkStatus: boolean) => {
      this.networkStatus = networkStatus;
      this.changeDetectorRef.markForCheck()
    });

    Network.addListener('networkStatusChange', (networkStatus: NetworkStatus) => {
      this.networkStatus = networkStatus.connected;
      if (networkStatus.connected) this.loadData(false);
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

    console.log(this.activatedRoute.snapshot.data.events);
  }

  private async loadData(clearStorage: boolean) {
    this.dataService.getEvents('', true).subscribe((events: Array<Event>) => {
      if(clearStorage) {
        this.storageService.removeCachedImages()
          .then(() => {
            this.events = events;
            this.changeDetectorRef.markForCheck();
          });
      } else if (!this._events.length || this._events.length !== events.length) {
        this.events = events;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  public async refresh(ev) {
    if (this._networkStatus) await this.loadData(true);
    ev.detail.complete();
  }

  public trackByFn(index, item) {
    return item.id;
  }

  public set filteredEvents(event) {
    this._filteredEvents = event;
  }

  private set events(events: Array<Event>) {
    this._events = events
  }

  private set networkStatus(networkStatus: boolean) {
    this._networkStatus = networkStatus
  }
}
