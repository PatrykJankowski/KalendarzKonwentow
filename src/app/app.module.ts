import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localePl from '@angular/common/locales/pl';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { Calendar } from '@ionic-native/calendar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

registerLocaleData(localePl);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [
    Calendar,
    {provide: LOCALE_ID, useValue: 'pl'},
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  exports: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
