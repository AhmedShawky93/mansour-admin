import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserSubAdminComponent } from './user-sub-admin.component';

describe('UserSubAdminComponent', () => {
  let component: UserSubAdminComponent;
  let fixture: ComponentFixture<UserSubAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSubAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSubAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
