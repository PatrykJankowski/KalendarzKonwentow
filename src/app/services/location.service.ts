import { Injectable } from '@angular/core';

import { Geolocation, Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  public lat: number;
  public long: number;

  constructor() {}

  public async getLocation() {
    const position = await Geolocation.getCurrentPosition();
    this.lat = position.coords.latitude;
    this.long = position.coords.longitude;

    return [this.lat, this.long]
  }
}
