import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventListCardComponent } from './event-list-card.component';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule, IonicImageLoader],
  declarations: [EventListCardComponent],
  exports: [EventListCardComponent]
})
export class EventListCardComponentModule {}
