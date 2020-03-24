import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';

const { Network } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  constructor() {}

  public async getCurrentNetworkStatus(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }
}
