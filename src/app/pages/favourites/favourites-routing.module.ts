import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavouritesPage } from './favourites.page';
import { FavouritesResolver } from './favourites.resolver';

const routes: Routes = [
  {
    path: '',
    component: FavouritesPage,
    resolve: { events: FavouritesResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavouritesPageRoutingModule {}
