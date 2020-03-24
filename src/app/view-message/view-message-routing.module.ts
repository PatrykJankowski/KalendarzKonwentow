import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewMessagePage } from './view-message.page';
import { EventDetailsResolver } from './event-details.resolver';

const routes: Routes = [
  { path: '', component: ViewMessagePage, resolve: { eventDetails: EventDetailsResolver } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventDetailsRouterModule {}
