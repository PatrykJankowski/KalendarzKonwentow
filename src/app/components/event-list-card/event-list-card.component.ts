import { Component, Input } from '@angular/core';
import { Event } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';

@Component({
  selector: 'app-event-list-card',
  templateUrl: './event-list-card.component.html',
  styleUrls: ['./event-list-card.component.scss'],
})
export class EventListCardComponent {
  @Input() event: Event;
  //public img = '';


  constructor(public favouritesService: FavouriteService) {}

  ngOnInit() {
/*    console.log('sad');

    Storage.get({key: 'img' + this.event.id}).then((image) => {
      if (image.value) {
        this.img = image.value;
      } else {
        fetch(this.removeWww(this.event.image)).then((response) => {
          return response.blob();
        }).then((myBlob) => {
          //Storage.set({key: 'img' + this.event.id, value: this.img}).then(() => this.img = URL.createObjectURL(myBlob));


   /!*       var reader = new FileReader();
          reader.readAsDataURL(myBlob);
          reader.onloadend = function() {
            var base64data = reader.result;
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaa', base64data);
          }*!/

            /!*const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)*!/





            function toDataURL(src, callback, outputFormat) {
                var img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = function() {
                    var canvas = document.createElement('CANVAS');
                    var ctx = canvas.getContext('2d');
                    var dataURL;
                    canvas.height = this.naturalHeight;
                    canvas.width = this.naturalWidth;
                    ctx.drawImage(this, 0, 0);
                    dataURL = canvas.toDataURL(outputFormat);
                    callback(dataURL);
                };
                img.src = src;
                if (img.complete || img.complete === undefined) {
                    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                    img.src = src;
                }
            }





          function getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
          }
console.log('dddddddddddddddddddddddddddddddddddddddddddd')
          var base64 = getBase64Image(document.getElementById("x"));
          console.log('baseeeeeeeeeeeeeeee', base64)



          const fileName = 'image'+this.event.id+'.jpg';

          Filesystem.writeFile({
            data: base64,
            path: fileName,
            directory: FilesystemDirectory.Data
          }).then(
              () => {
                Filesystem.getUri({
                  directory: FilesystemDirectory.Data,
                  path: fileName
                }).then(
                    result => {
                      let path = Capacitor.convertFileSrc(result.uri);
                      console.log(result.uri);
                      console.log(path);
                      this.img = path;
                    },
                    err => {
                      console.log(err);
                    }
                );
              },
              err => {
                console.log(err);
              });




        }).catch(() => this.img = '/assets/no-image.jpg');
      }
    });


    this.http.get(this.removeWww(this.event.image), {responseType: 'blob'}).subscribe((data: Blob) => {


      /!*fetch(this.removeWww(this.event.image)).then((response) => {
        return response.blob();
      }).then((blob) => {
        this.img = URL.createObjectURL(blob);
        Storage.set({key: 'img'+this.event.id, value: this.img});
      });*!/
    })*/

  }


/*
  public getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");
console.log(dataURL)
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }
*/







/*  ngOnChanges() {
    Storage.get({key: 'img' + this.event.id}).then((image) => {
      console.log(this.event.id);
      console.log('img val', image.value);
      if (image.value) {
        this.img = image.value;
      } else {
        fetch(this.removeWww(this.event.image)).then((response) => {
          return response.blob();
        }).then((myBlob) => {
          Storage.set({key: 'img' + this.event.id, value: this.img}).then(() =>this.img = URL.createObjectURL(myBlob));
        }).catch(() => this.img = '/assets/no-image.jpg');
      }
    });
  }*/

  public addToFavourites(event: Event): void {
    this.favouritesService.addToFavorites(event).then();
  }

  public removeFromFavourites(id: Event): void {
    this.favouritesService.removeFromFavourites(id).then();
  }

  public loadDefaultImage(event): void {
    event.target.src = '/assets/no-image.jpg';
  }

  public removeWww(url) {
    return url.replace("/www.", "/");
  }
}
