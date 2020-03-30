import { Component, Input, ViewChild } from '@angular/core';
import { Event } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Component({
  selector: 'app-event-list-card',
  templateUrl: './event-list-card.component.html',
  styleUrls: ['./event-list-card.component.scss'],
})
export class EventListCardComponent {
  @Input() event: Event;
  @ViewChild('imageReference') input;
  public img: string = '';

  constructor(public favouritesService: FavouriteService) {}


  ngOnChanges() {
    Storage.get({key: 'img' + this.event.id}).then((image) => {
      if (image.value) {
        this.img = image.value;
      } else {
        let imageElement = this.input.nativeElement;
        let id = this.event.id;
        let image = this.event.image;

        this.img = this.event.image;
        console.log('1', imageElement);

        // Take action when the image has loaded
        imageElement.addEventListener("load", function handler() {

          imageElement.removeEventListener('load', handler);

          fetch(image).then((response) => {
            if (response.status == 200) {
              let imgCanvas = document.createElement("canvas");
              let imgContext = imgCanvas.getContext("2d");

              // Make sure canvas is as big as the picture
              imgCanvas.width = imageElement.width;
              imgCanvas.height = imageElement.height;

              // Draw image into canvas element
              imgContext.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);

              // Get canvas contents as a data URL
              let imgAsDataURL = imgCanvas.toDataURL("image/png");

              // Save image into localStorage
              try {
                Storage.set({key: 'img'+id, value: imgAsDataURL});
              } catch(err) {
                return err;
              }
            }
          });
        }, false);

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
