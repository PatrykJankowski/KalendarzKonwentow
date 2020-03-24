import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FiltersComponent } from './filters.component';

@NgModule({
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterModule],
  declarations: [FiltersComponent],
  exports: [FiltersComponent]
})
export class FiltersComponentModule {}
