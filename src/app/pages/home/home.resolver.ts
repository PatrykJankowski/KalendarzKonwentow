import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { DataService } from '@services/data.service';

@Injectable({
  providedIn: 'root'
})
export class HomeResolver implements Resolve<any> {
  private refreshFlag: boolean = true;

  constructor(private dataService: DataService) {}

  public resolve(): any {
    console.log("resolver");
    const events = this.dataService.getEvents('', this.refreshFlag);
    this.refreshFlag ? this.refreshFlag = false : '';

    return events;
  }
}
