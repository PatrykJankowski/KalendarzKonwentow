import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArchivalEventsPageRoutingModule } from './archival-events-routing.module';

import { ArchivalEventsPage } from './archival-events.page';
import { EventListCardComponentModule } from '../../components/event-list-card/event-list-card.module';
import { FiltersComponentModule } from '../../components/filters/filters.module';
import { HomeRouterModule } from '../home/home.router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArchivalEventsPageRoutingModule,

    EventListCardComponentModule,
    FiltersComponentModule,
    HomeRouterModule,
  ],
  declarations: [ArchivalEventsPage]
})
export class ArchivalEventsPageModule {}
