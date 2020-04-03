import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Plugins } from '@capacitor/core';

import { Event } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';
import { HexBase64BinaryEncoding } from 'crypto';

const {Storage} = Plugins;

@Component({
  selector: 'app-event-list-card',
  templateUrl: './event-list-card.component.html',
  styleUrls: ['./event-list-card.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventListCardComponent implements OnChanges {
  @Input() event: Event;
  @Input() networkStatus: boolean = true;
  
  private transparentImage: HexBase64BinaryEncoding = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  constructor(private changeDetectorRef: ChangeDetectorRef, public favouritesService: FavouriteService, public sanitizer: DomSanitizer) {
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes.event.currentValue.image);
    if(this.event.image.includes('http') || this.event.image === this.transparentImage) {
      Storage.get({key: 'img' + this.event.id}).then((image) => {
        if (image.value) {
          this.event.image = image.value;
          this.changeDetectorRef.markForCheck();
        } else if(this.networkStatus) {
          this.convertImageToBase64(this.event.image).then((dataUrl: string) => {
            Storage.set({key: 'img' + this.event.id, value: dataUrl});
          });
          this.changeDetectorRef.markForCheck();
        } else {
          this.event.image = this.transparentImage;
        }
      });
    }
  }

  private async convertImageToBase64(url): Promise<any> {
    const response = await fetch(url);
    const blob = await response.blob();
    const result = new Promise((resolve, reject) => {
      if (blob.type === 'text/html') {
        // this.event.image = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        resolve(this.transparentImage);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject;
        reader.readAsDataURL(blob);
      }
    });

    return await result;
  }

  public addToFavourites(event: Event): void {
    this.favouritesService.addToFavorites(event).then(() => this.changeDetectorRef.markForCheck());
  }

  public removeFromFavourites(event: Event): void {
    this.favouritesService.removeFromFavourites(event).then(() => this.changeDetectorRef.markForCheck());
  }

  public isFavourite(id: number): boolean {
    return this.favouritesService.isFavourite(id);
  }

  /*public loadDefaultImage(event): void {
    event.target.src = '/assets/no-image.jpg';
  }*/
}
