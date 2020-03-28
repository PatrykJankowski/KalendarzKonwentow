import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { DataService } from '@services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ArchivalEventsResolver implements Resolve<any> {
  private refreshFlag: boolean = true;

  constructor(private dataService: DataService) {}

  public resolve(): any {
    const events = this.dataService.getEvents(new Date().getFullYear().toString(), this.refreshFlag);
    this.refreshFlag ? this.refreshFlag = false : '';

    return events;
  }
}
