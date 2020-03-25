import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { DataService } from '@services/data.service';

@Injectable({
  providedIn: 'root'
})
export class EventDetailsResolver implements Resolve<any> {
  constructor(private dataService: DataService) {}

  public resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): any {
    return this.dataService.getEventDetails(activatedRouteSnapshot.params.id);
  }
}
