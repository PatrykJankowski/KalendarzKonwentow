import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { Calendar } from '@ionic-native/calendar/ngx';

import { Plugins } from '@capacitor/core';

import { EventDetails } from '@models/event.model';
import { Event } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsPage implements OnInit{
  public eventDetails: EventDetails = this.activatedRoute.snapshot.data.eventDetails[0];
  public image: string;

  constructor(private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              public sanitizer: DomSanitizer,
              public favouritesService: FavouriteService,
              private calendar: Calendar
              ) {}

  public ngOnInit(): void {
/*    Storage.get({key: 'img' + this.activatedRoute.snapshot.params.id}).then((image) => {
      if (image.value) {
        this.image = image.value;
        this.changeDetectorRef.markForCheck();
      } else {
        this.image = '/assets/no-image.jpg';
      }
    });*/
  }

  public addToCalendar(): void {
    this.calendar.createEventInteractively(
      this.eventDetails.name, this.eventDetails.location, this.eventDetails.description,
      new Date(this.eventDetails.date_begin+', 12:00'), new Date(this.eventDetails.date_end+', 12:00')).then();
  }

  /*public loadDefaultImage(event): void {
    event.target.src = '/assets/no-image.jpg';
  }*/

  public addToFavourites(event: Event): void {
    this.favouritesService.addToFavorites(event).then(() => this.changeDetectorRef.markForCheck());
  }

  public removeFromFavourites(event: Event): void {
    this.favouritesService.removeFromFavourites(event).then(() => this.changeDetectorRef.markForCheck());
  }

  public isFavourite(id: number) {
    return this.favouritesService.isFavourite(id);
  }
}
