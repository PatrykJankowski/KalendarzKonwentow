import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';
import { HomeResolver } from './home.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    resolve: { events: HomeResolver }
  },
  {
    path: 'event-details/:id',
    loadChildren: () => import('../event-details/event-details.module').then(m => m.EventDetailsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeRouterModule {}
