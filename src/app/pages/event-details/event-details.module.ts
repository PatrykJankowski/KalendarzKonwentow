import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { EventDetailsPage } from './event-details.page';
import { EventDetailsPageRoutingModule } from './event-details-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventDetailsPageRoutingModule
  ],
  declarations: [EventDetailsPage]
})
export class EventDetailsPageModule {}
