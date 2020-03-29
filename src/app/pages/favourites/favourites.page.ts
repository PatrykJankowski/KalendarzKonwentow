import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataService } from '@services/data.service';
import { ActivatedRoute } from '@angular/router';
import { FavouriteService } from '@services/favourites.service';
import { FiltersService } from '@services/filters.service';
import { Network } from '@capacitor/core';
import { Event } from '@models/event.model';


@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {
  @Output() eventsChange = new EventEmitter();

  public events;


  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService, private filtersService: FiltersService) {}

  public ngOnInit() {
    this.events = this.activatedRoute.snapshot.data.events;


    this.favouritesService.favouritesChange.subscribe(value => {console.log('change: ', value)});

    //this.favouritesService.getFavoritesEvents().then((k) => console.log(k.valueOf()));

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

  ngOnChanges() {
    this.events = this.activatedRoute.snapshot.data.events;
    this.eventsChange.emit(this.events);

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
