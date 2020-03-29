import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventListCardComponent } from './event-list-card.component';
import { RemoveWwwPipe } from '../../removeWww.pipe';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule],
  declarations: [EventListCardComponent, RemoveWwwPipe],
  exports: [EventListCardComponent]
})
export class EventListCardComponentModule {}
