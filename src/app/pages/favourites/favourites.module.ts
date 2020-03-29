import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavouritesPageRoutingModule } from './favourites-routing.module';

import { FavouritesPage } from './favourites.page';
import { EventListCardComponentModule } from '../../components/event-list-card/event-list-card.module';
import { FiltersComponentModule } from '../../components/filters/filters.module';
import { HomeRouterModule } from '../home/home.router';

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
