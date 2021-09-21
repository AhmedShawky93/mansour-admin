import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEditOrderStatesComponent } from './add-edit-order-states.component';

describe('AddEditOrderStatesComponent', () => {
  let component: AddEditOrderStatesComponent;
  let fixture: ComponentFixture<AddEditOrderStatesComponent>;

  beforeEach(waitForAsync(() => {
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
