import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { ConnectionStatus } from '@models/network'

import { Plugins } from '@capacitor/core';
const { Network } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

  constructor() {}

  public onNetworkChange(): Observable<ConnectionStatus> {
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
    });
    return this.status.asObservable();
  }

  public async getCurrentNetworkStatus(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }
}
