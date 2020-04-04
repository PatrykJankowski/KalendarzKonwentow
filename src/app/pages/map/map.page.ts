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

  public lat: number = 52;
  public long: number = 19;
  public zoom: number = 6;

  constructor(private activatedRoute: ActivatedRoute, private networkService: NetworkService, private changeDetectorRef: ChangeDetectorRef, private locationService: LocationService) { }

  ngOnInit() {
    this.events = this.activatedRoute.snapshot.data.events;

    this.locationService.getLocation().then((coordinates) => {
      this.lat = coordinates[0];
      this.long = coordinates[1];
      this.zoom = 11;

      this.changeDetectorRef.detectChanges();
    });

    this.networkService.getCurrentNetworkStatus().then((networkStatus: boolean) => {
      this.networkStatus = networkStatus;
      this.changeDetectorRef.markForCheck()
    });
  }
}
