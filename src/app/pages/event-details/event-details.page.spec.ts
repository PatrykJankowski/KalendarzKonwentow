import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventDetailsPageRoutingModule } from './event-details-routing.module';
import { EventDetailsPage } from './event-details.page';

describe('ViewMessagePage', () => {
  let component: EventDetailsPage;
  let fixture: ComponentFixture<EventDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventDetailsPage ],
      imports: [IonicModule.forRoot(), EventDetailsPageRoutingModule, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
