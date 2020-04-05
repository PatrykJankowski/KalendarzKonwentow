import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { DataService } from '@services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ArchivalEventsResolver implements Resolve<any> {

  constructor(private dataService: DataService) {}

  public resolve(): any {
    return this.dataService.getEvents(new Date().getFullYear().toString());
  }
}
