import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Event } from '@models/event.model';
import { LocationService } from '@services/location.service';
import { NetworkService } from '@services/network.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  public events: Array<Event> = [];
  public networkStatus: boolean;

  public zoom: number = 6;

  constructor(private activatedRoute: ActivatedRoute, private networkService: NetworkService, private changeDetectorRef: ChangeDetectorRef, private locationService: LocationService) { }

  ngOnInit() {
    this.events = this.activatedRoute.snapshot.data.events;

    this.networkService.getCurrentNetworkStatus().then((networkStatus: boolean) => {
      this.networkStatus = networkStatus;
      this.changeDetectorRef.markForCheck()
    });
  }

  public getLat() {
    if (this.locationService.getLat() !== 52) this.zoom = 11;
    this.changeDetectorRef.markForCheck();
    return this.locationService.getLat();
  }

  public getLong() {
    return this.locationService.getLong();
  }
}
