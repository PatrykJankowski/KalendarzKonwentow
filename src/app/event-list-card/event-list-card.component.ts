import { Component, OnInit, Input } from '@angular/core';
import { Event } from '@models/event.model';

@Component({
  selector: 'app-event-list-card',
  templateUrl: './event-list-card.component.html',
  styleUrls: ['./event-list-card.component.scss'],
})
export class EventListCardComponent implements OnInit {
  @Input() event: Event;

  constructor() { }

  ngOnInit() {}

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }
}
