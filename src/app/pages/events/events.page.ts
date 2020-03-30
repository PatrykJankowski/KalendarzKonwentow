import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsPage {
  constructor() {}
}
