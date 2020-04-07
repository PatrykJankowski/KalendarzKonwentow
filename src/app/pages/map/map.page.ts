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
  public events: Array<Event>;
  public networkStatus: boolean;
  public _zoom: number = 6;

  constructor(private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private networkService: NetworkService,
              private locationService: LocationService) {}

  ngOnInit() {
    this.events = this.activatedRoute.snapshot.data.events;

    this.networkService.getCurrentNetworkStatus().then((networkStatus: boolean) => {
      this.networkStatus = networkStatus;
      this.changeDetectorRef.markForCheck()
    });
  }

  private set zoom(zoom) {
    this._zoom = zoom;
  }

  public get lat() {
    if (this.locationService.getLat() !== 52) this.zoom = 11;
    return this.locationService.getLat();
  }

  public get long() {
    return this.locationService.getLong();
  }
}
