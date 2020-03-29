import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArchivalEventsPage } from './archival-events.page';
import { ArchivalEventsResolver } from './archival-events.resolver';

const routes: Routes = [
  {
    path: '',
    component: ArchivalEventsPage,
    resolve: { events: ArchivalEventsResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArchivalEventsPageRoutingModule {}
