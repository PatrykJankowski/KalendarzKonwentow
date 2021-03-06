import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Network, NetworkStatus } from '@capacitor/core';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';
import { NetworkService } from '@services/network.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavouritesPage implements OnInit, OnChanges {
  @Output() eventsChange = new EventEmitter();
  @Input() filteredEvents: Array<Event> = [];

  public events: Array<Event> = [];
  public _networkStatus: boolean = true;

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService, private networkService: NetworkService, private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit() {
    this.events = this.activatedRoute.snapshot.data.events;
    this.networkService.getCurrentNetworkStatus().then((networkStatus: boolean) => {
      this.networkStatus = networkStatus;
      this.changeDetectorRef.markForCheck()
    });

    Network.addListener('networkStatusChange', (networkStatus: NetworkStatus) => {
      this.networkStatus = networkStatus.connected;
      this.changeDetectorRef.detectChanges();
    });

    this.favouritesService.favouritesChange.subscribe(events => {
      this.changeDetectorRef.markForCheck();
      this.filteredEvents = events;
    });
  }

  public ionViewWillEnter(): void {
    setTimeout(() => {
      // Remove dropdown arrow; hope for better solution in future Ionic version
      const ionSelects: NodeListOf<HTMLIonSelectElement> = document.querySelectorAll('ion-select');
      ionSelects.forEach((select: HTMLIonSelectElement) => {
        select.shadowRoot.querySelectorAll('.select-icon')
          .forEach((element: HTMLElement) => {
            element.setAttribute('style', 'display: none');
          });
      });
    }, 0);
  }

  public ngOnChanges() {
    this.events = this.activatedRoute.snapshot.data.events;
    this.eventsChange.emit(this.events);
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

  public ionViewDidEnter(): void {
    this.changeDetectorRef.markForCheck();
  }

  public loadDefaultImage(event): void {
    event.target.src = '/assets/no-image.jpg';
  }
}
