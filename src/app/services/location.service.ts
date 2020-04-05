import { Injectable } from '@angular/core';

import { Geolocation, Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  public lat: number = 52;
  public long: number = 19;

  constructor() {}

  public async getLocation() {
    const position = await Geolocation.getCurrentPosition();
    this.lat = position.coords.latitude;
    this.long = position.coords.longitude;

    return [this.lat, this.long]
  }

  public getLat() {
    return this.lat;
  }

  public getLong() {
    return this.long;
  }
}
