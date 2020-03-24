import { Component, Input } from '@angular/core';
import { Event } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';
import { FiltersService } from '@services/filters.service';

@Component({
  selector: 'app-event-list-card',
  templateUrl: './event-list-card.component.html',
  styleUrls: ['./event-list-card.component.scss'],
})
export class EventListCardComponent {
  @Input() event: Event;

  constructor(public favouritesService: FavouriteService, private filtersService: FiltersService) { }

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

  public loadDefaultImage(event): void {
    event.target.src = '/assets/no-image.jpg';
  }
}
