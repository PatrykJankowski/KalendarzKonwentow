import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArchivalEventsPage } from './archival-events.page';

describe('ArchivalEventsPage', () => {
  let component: ArchivalEventsPage;
  let fixture: ComponentFixture<ArchivalEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivalEventsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ArchivalEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
