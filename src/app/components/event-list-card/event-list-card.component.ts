import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Plugins } from '@capacitor/core';

import { Event } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-event-list-card',
  templateUrl: './event-list-card.component.html',
  styleUrls: ['./event-list-card.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventListCardComponent implements OnChanges {
  @Input() event: Event;

  constructor(public favouritesService: FavouriteService, private changeDetectorRef: ChangeDetectorRef, public sanitizer: DomSanitizer) {
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    Storage.get({key: 'img' + this.event.id}).then((image) => {
      if (image.value) {
        this.event.image = image.value;
        this.changeDetectorRef.markForCheck();
      } else {
        const toDataURL = url => fetch(url)
          .then(response => {
            return response.blob();
          })
          .then(blob => new Promise((resolve, reject) => {
            if (blob.type === 'text/html') {
              // this.event.image = '/assets/no-image.jpg';
              resolve('/assets/no-image.jpg');
            } else {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            }
          })).catch((e) => console.log(e, 'as'));

        toDataURL(this.event.image).then((dataUrl: string) => {
          Storage.set({key: 'img' + this.event.id, value: dataUrl});
        }).catch();

        this.changeDetectorRef.markForCheck();
      }
    });
  }

  public addToFavourites(event: Event): void {
    this.favouritesService.addToFavorites(event).then(() => this.changeDetectorRef.markForCheck());
  }

  public removeFromFavourites(event: Event): void {
    this.favouritesService.removeFromFavourites(event).then(() => this.changeDetectorRef.markForCheck());
  }

  public isFavourite(id: number) {
    return this.favouritesService.isFavourite(id);
  }

  public loadDefaultImage(event): void {
    event.target.src = '/assets/no-image.jpg';
  }
}
