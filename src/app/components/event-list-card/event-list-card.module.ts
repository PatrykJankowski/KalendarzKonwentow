import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RemoveWwwPipe } from '../../removeWww.pipe';
import { EventListCardComponent } from './event-list-card.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule],
  declarations: [EventListCardComponent, RemoveWwwPipe],
  exports: [EventListCardComponent]
})
export class EventListCardComponentModule {}
