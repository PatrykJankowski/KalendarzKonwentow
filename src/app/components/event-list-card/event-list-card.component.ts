import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Plugins } from '@capacitor/core';

import { Event } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';
import { StorageService } from '@services/storage.service';

const {Storage} = Plugins;

@Component({
  selector: 'app-event-list-card',
  templateUrl: './event-list-card.component.html',
  styleUrls: ['./event-list-card.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventListCardComponent implements OnChanges, OnInit {
  @Input() event: Event;
  @Input() networkStatus: boolean = true;

  image;

  private transparentImage: string = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  constructor(private changeDetectorRef: ChangeDetectorRef, public favouritesService: FavouriteService, public sanitizer: DomSanitizer, private storageService: StorageService) {
    this.changeDetectorRef.markForCheck();
    //this.image(1128).then((a) => console.log(a))
  }

  ngOnInit() {
    console.log(this.event.image)
    this.image = this.event.image;
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges()
  }

  /*public async image(id) {
    return await this.storageService.getLocalData(`img-${id}`);
  }*/


  ngOnChanges(changes: SimpleChanges) {
    Storage.get({key: 'img-' + this.event.id}).then((image) => {
      if (image.value) {
        this.image = JSON.parse(image.value).data;
        this.changeDetectorRef.markForCheck()
      } else {
        this.image = this.event.image;
        this.changeDetectorRef.markForCheck()
      }
    });
/*    if(this.event.image.includes('http') || this.event.image === this.transparentImage) {

      Storage.get({key: 'img' + this.event.id}).then((image) => {
        if (image.value) {
          this.event.image = image.value; // todo: do not assign a var to event object
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
    }*/
  }

  private async convertImageToBase64(url): Promise<any> {
    const response = await fetch(url);
    const blob = await response.blob();
    const result = new Promise((resolve, reject) => {
      if (blob.type === 'text/html') {
        // this.event.image = transparentImage;
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
