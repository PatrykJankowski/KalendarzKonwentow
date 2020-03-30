import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Network } from '@capacitor/core';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';

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

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService, private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit() {
    this.events = this.activatedRoute.snapshot.data.events;

    this.favouritesService.favouritesChange.subscribe(events => {
      this.filteredEvents = events;
      this.changeDetectorRef.markForCheck();
    });

    Network.addListener('networkStatusChange', (status) => {
      if(status.connected) {
        this.dataService.getEvents('', true).subscribe((events: Array<Event>) => {
          this.events = events;
          console.log('online');
        });
      }
    })
  }

  public ngOnChanges() {
    this.events = this.activatedRoute.snapshot.data.events;
    this.eventsChange.emit(this.events);
  }

  public trackByFn(index, item) {
    return item.id;
  }

  public eventsFiltered(event) {
    this.filteredEvents = event;
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

  public loadDefaultImage(event): void {
    event.target.src = '/assets/no-image.jpg';
  }
}
