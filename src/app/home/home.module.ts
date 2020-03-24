import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventListCardComponentModule } from '../event-list-card/event-list-card.module';
import { FiltersComponentModule } from '../filters/filters.module';
import { HomePage } from './home.page';
import { HomeRouterModule } from './home.router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,

    EventListCardComponentModule,
    FiltersComponentModule,
    HomeRouterModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
