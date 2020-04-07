import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';

import { Event } from '@models/event.model';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  public async setLocalData(key: string, data: Event | Array<Event>): Promise<any> {
    await Storage.set({
      key, value: JSON.stringify({data})
    });
  }

  public async getLocalData(key: string): Promise<any> {
    try {
      const storageData = await Storage.get({ key });
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

  public async setImages(events) {
    for (const event of events) {
      const image = await this.convertImageToBase64(event.image);
      await this.setLocalData(`img-${event.id}`, image)
    }
  }

  private async convertImageToBase64(url): Promise<any> {
    const response = await fetch(url);
    const blob = await response.blob();
    const result = new Promise((resolve, reject) => {
      if (blob.type === 'text/html') {
        resolve('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      } else {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject;
        reader.readAsDataURL(blob);
      }
    });

    return await result;
  }
}
