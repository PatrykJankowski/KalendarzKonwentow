import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventsPage } from './events.page';

const routes: Routes = [
  {
    path: 'events',
    component: EventsPage,
    children: [
      {
        path: 'list',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'archival',
        children: [
          {
            path: '',
            loadChildren: () => import('../archival-events/archival-events.module').then(m => m.ArchivalEventsPageModule)
          }
        ]
      },
      {
        path: 'favourites',
        children: [
          {
            path: '',
            loadChildren: () => import('../favourites/favourites.module').then(m => m.FavouritesPageModule)
          }
        ]
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: () => import('../map/map.module').then(m => m.MapPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/events/list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/events/list',
    pathMatch: 'full'
  },
  {
    path: 'event-details/:id',
    loadChildren: () => import('../event-details/event-details.module').then(m => m.EventDetailsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsPageRoutingModule {}
