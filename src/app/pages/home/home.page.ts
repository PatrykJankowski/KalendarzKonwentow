import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Network, Plugins } from '@capacitor/core';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';

const {Storage} = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit {
  @Input() filteredEvents: Array<Event> = [];

  public events: Array<Event> = [];
  private status: boolean;

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService, private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit() {
    this.events = this.activatedRoute.snapshot.data.events;

    // do serwisu
    Network.getStatus().then((status) => {
      this.status = status.connected;
    });

    Network.addListener('networkStatusChange', (status) => {
      this.status = status.connected;
      if (status.connected) {
        this.dataService.getEvents('', true).subscribe((events: Array<Event>) => {
          Storage.clear().then(() => {
            this.events = events;
            this.changeDetectorRef.markForCheck();
          });
        });
      }
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

    // this.changeDetectorRef.markForCheck();
    // this.changeDetectorRef.detectChanges();
  }

  public trackByFn(index, item) {
    return item.id;
  }

  public eventsFiltered(event) {
    this.filteredEvents = event;
  }

  public refresh(ev) {
    if (this.status) {
      this.dataService.getEvents('', true).subscribe((events: Array<Event>) => {
        Storage.clear().then(() => {
          this.events = events;
          ev.detail.complete();
          this.changeDetectorRef.markForCheck();
        }).catch(() => ev.detail.complete());
      });
    } else {
      ev.detail.complete();
    }
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
