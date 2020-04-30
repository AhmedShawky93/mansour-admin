import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOrderStatesComponent } from './add-edit-order-states.component';

describe('AddEditOrderStatesComponent', () => {
  let component: AddEditOrderStatesComponent;
  let fixture: ComponentFixture<AddEditOrderStatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditOrderStatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditOrderStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
