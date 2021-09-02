import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPageComponent } from './add-edit-page.component';

describe('AddEditPageComponent', () => {
  let component: AddEditPageComponent;
  let fixture: ComponentFixture<AddEditPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
