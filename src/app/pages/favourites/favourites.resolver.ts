import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FavouritesResolver implements Resolve<any> {
  private refreshFlag: boolean = true;
  private readonly STORAGE_KEY: string = 'favoriteEvents';

  constructor() {}

  public resolve(): any {
    return Storage.get({key: this.STORAGE_KEY}).then((s) => JSON.parse(s.value));
  }
}
