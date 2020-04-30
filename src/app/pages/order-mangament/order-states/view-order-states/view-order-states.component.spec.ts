import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderStatesComponent } from './view-order-states.component';

describe('ViewOrderStatesComponent', () => {
  let component: ViewOrderStatesComponent;
  let fixture: ComponentFixture<ViewOrderStatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOrderStatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOrderStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
