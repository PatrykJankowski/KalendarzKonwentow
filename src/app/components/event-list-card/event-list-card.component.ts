import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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
  @ViewChild('imageReference') input;
  @Input() event: Event;

  public img = '';

  constructor(public favouritesService: FavouriteService, private changeDetectorRef: ChangeDetectorRef, public sanitizer: DomSanitizer) {
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
      Storage.get({key: 'img' + this.event.id}).then((image) => {
        if (image.value) {
          this.img = image.value;
          this.changeDetectorRef.markForCheck();
        } else {

          const id = this.event.id;
          this.img = this.event.image;

          const toDataURL = url => fetch(url)
              .then(response => response.blob())
              .then(blob => new Promise((resolve, reject) => {

               if (blob.type === 'text/html') {
                   this.img = '/assets/no-image.jpg';
                   resolve('/assets/no-image.jpg');
               } else {
                   const reader = new FileReader();
                   reader.onloadend = () => resolve(reader.result);
                   reader.onerror = reject;
                   reader.readAsDataURL(blob)
               }

              }));

          toDataURL(this.event.image)
              .then((dataUrl: string) => {
                console.log('RESULT:', dataUrl);
                Storage.set({key: 'img'+id, value: dataUrl});
              });

         /* const imageElement = this.input.nativeElement;
          const id = this.event.id;
          const imageUrl = this.event.image;

          this.img = this.event.image;

          // Take action when the image has loaded
          imageElement.addEventListener('load', function handler() {

            imageElement.removeEventListener('load', handler);

            fetch(imageUrl).then((response) => {
              if (response.status === 200) {
                const imgCanvas = document.createElement('canvas');
                const imgContext = imgCanvas.getContext('2d');

                // Make sure canvas is as big as the picture
                imgCanvas.width = imageElement.width;
                imgCanvas.height = imageElement.height;

                // Draw image into canvas element
                imgContext.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);

                // Get canvas contents as a data URL
                const imgAsDataURL = imgCanvas.toDataURL('image/png');

                // Save image into localStorage
                Storage.set({key: 'img'+id, value: imgAsDataURL});
              } else {
                Storage.set({key: 'img'+id, value: '/assets/no-image.jpg'});
              }
            });
          }, false);*/
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  public addToFavourites(event: Event): void {
    this.favouritesService.addToFavorites(event).then();
  }

  public removeFromFavourites(id: Event): void {
    this.favouritesService.removeFromFavourites(id).then();
  }

  public loadDefaultImage(event): void {
    event.target.src = '/assets/no-image.jpg';
  }
}
