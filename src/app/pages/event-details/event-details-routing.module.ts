import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventDetailsPage } from './event-details.page';
import { EventDetailsResolver } from './event-details.resolver';

const routes: Routes = [
  { path: '', component: EventDetailsPage, resolve: { eventDetails: EventDetailsResolver } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventDetailsPageRoutingModule {}
