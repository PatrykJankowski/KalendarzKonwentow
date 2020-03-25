import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Calendar } from '@ionic-native/calendar/ngx';

import { EventDetails } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';
import { FiltersService } from '@services/filters.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage {
  public eventDetails: EventDetails = this.activatedRoute.snapshot.data.eventDetails[0];

  constructor(private activatedRoute: ActivatedRoute, private filtersService: FiltersService, public favouritesService: FavouriteService, private calendar: Calendar) {}

   public addToCalendar(): void {
      this.calendar.createEventInteractively(
          this.eventDetails.name, this.eventDetails.location, this.eventDetails.description,
          new Date(this.eventDetails.date_begin), new Date(this.eventDetails.date_end)
      ).then();
    }

  public loadDefaultImage(event): void {
    event.target.src = '/assets/no-image.jpg';
  }

  public addToFavourites(id: number): void {
    this.favouritesService.addToFavorites(id).then(() => {
      if (this.favouritesService.getFavouritesOnlyFlag()) {
        this.filtersService.filterEvents(this.filtersService.filteredEvents)
      }
    });
  }

  public removeFromFavourites(id: number): void {
    this.favouritesService.removeFromFavourites(id).then(() => {
      if (this.favouritesService.getFavouritesOnlyFlag()) {
        this.filtersService.filterEvents(this.filtersService.filteredEvents)
      }
    });
  }

  public isFavourite(id: number) {
    return this.favouritesService.isFavourite(id)
  }
}
