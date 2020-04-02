import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';

import { Event } from '@models/event.model';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly API_STORAGE_KEY: string = 'KK';

  constructor() {}
  
  public async setLocalData(key: string, data: Event): Promise<any> {
    await Storage.set({
      key: `${this.API_STORAGE_KEY}-${key}`, value: JSON.stringify({data})
    });
  }

  public async getLocalData(key: string): Promise<any> {
    try {
      const storageData = await Storage.get({ key: `${this.API_STORAGE_KEY}-${key}` });
      return JSON.parse(storageData.value).data;
    } catch(error) {
      return [];
    }
  }

  public async removeCachedImages() {
    const { keys } = await Storage.keys();
    for (const key of keys ) {
      if(new RegExp('img').test(key)) {
        await Storage.remove({ key });
      }
    }
  }
}