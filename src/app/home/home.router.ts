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
    loadChildren: () => import('../view-message/view-message.module').then( m => m.ViewMessagePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeRouterModule {}
