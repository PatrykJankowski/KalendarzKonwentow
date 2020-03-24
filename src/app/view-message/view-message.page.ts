import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Calendar } from '@ionic-native/calendar/ngx';

import { EventDetails } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage {
  public eventDetails: EventDetails = this.activatedRoute.snapshot.data.eventDetails[0];

  constructor(private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService, private calendar: Calendar) {}

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
    this.favouritesService.addToFavorites(id).then();
  }

  public removeFromFavourites(id: number): void {
    this.favouritesService.removeFromFavourites(id).then();
  }

  public isFavourite(id: number) {
    return this.favouritesService.isFavourite(id)
  }
}
