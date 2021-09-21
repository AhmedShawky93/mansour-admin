import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccessAdminsComponent } from './access-admins.component';

describe('AccessAdminsComponent', () => {
  let component: AccessAdminsComponent;
  let fixture: ComponentFixture<AccessAdminsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessAdminsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
