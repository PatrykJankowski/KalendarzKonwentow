// import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// import localePl from '@angular/common/locales/pl';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { Calendar } from '@ionic-native/calendar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// registerLocaleData(localePl);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyABDqSFgbPT0iBn80-MJPFm5GmUiI38pFw',
      libraries: ['places']
    }),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    Calendar,
    // {provide: LOCALE_ID, useValue: 'pl'},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
