import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { DataService } from '@services/data.service';

@Injectable({
  providedIn: 'root'
})
export class EventDetailsResolver implements Resolve<any> {
  private refreshFlag: boolean = true;

  constructor(private dataService: DataService) {}

  public resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): any {
    const events = this.dataService.getEventDetails(activatedRouteSnapshot.params.id, this.refreshFlag);
    this.refreshFlag ? this.refreshFlag = false : '';

    return events;
  }
}
