import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapPage } from './map.page';
import { MapResolver } from './map.resolver';

const routes: Routes = [
  {
    path: '',
    component: MapPage,
    resolve: { events: MapResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapPageRoutingModule {}
