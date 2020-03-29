import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Calendar } from '@ionic-native/calendar/ngx';

import { EventDetails } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';
import { FiltersService } from '@services/filters.service';
import { Plugins } from '@capacitor/core';
import { Event } from '@models/event.model';

const { Storage } = Plugins;

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage {
  public eventDetails: EventDetails = this.activatedRoute.snapshot.data.eventDetails[0];
  public img;

  constructor(private activatedRoute: ActivatedRoute, private filtersService: FiltersService, public favouritesService: FavouriteService, private calendar: Calendar) {
    Storage.get({key: 'img' + this.activatedRoute.snapshot.params.id}).then((image) => {
      if (image.value) {
        this.img = image.value;
      } else {
        this.img = '/assets/no-image.jpg';
      }
    });
  }

  public removeWww(url) {
    return url.replace("/www.", "/");
  }


  public addToCalendar(): void {
    this.calendar.createEventInteractively(
        this.eventDetails.name, this.eventDetails.location, this.eventDetails.description,
        new Date(this.eventDetails.date_begin), new Date(this.eventDetails.date_end)
    ).then();
  }

  public loadDefaultImage(event): void {
    event.target.src = '/assets/no-image.jpg';
  }

  public addToFavourites(event: Event): void {
    this.favouritesService.addToFavorites(event).then(() => {

        //this.filtersService.filterEvents(this.filtersService.filteredEvents)

    });
  }

  public removeFromFavourites(event: Event): void {
    this.favouritesService.removeFromFavourites(event).then(() => {

        //this.filtersService.filterEvents(this.filtersService.filteredEvents)

    });
  }

  public isFavourite(id: number) {
    return this.favouritesService.isFavourite(id)
  }
}
