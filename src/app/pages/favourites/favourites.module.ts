import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventListCardComponentModule } from '../../components/event-list-card/event-list-card.module';
import { FiltersComponentModule } from '../../components/filters/filters.module';
import { HomeRouterModule } from '../home/home.router';
import { FavouritesPageRoutingModule } from './favourites-routing.module';
import { FavouritesPage } from './favourites.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavouritesPageRoutingModule,

    EventListCardComponentModule,
    FiltersComponentModule,
    HomeRouterModule,
  ],
  declarations: [FavouritesPage]
})
export class FavouritesPageModule {}
