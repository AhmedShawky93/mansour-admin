import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSubAdminComponent } from './user-sub-admin.component';

describe('UserSubAdminComponent', () => {
  let component: UserSubAdminComponent;
  let fixture: ComponentFixture<UserSubAdminComponent>;

  beforeEach(async(() => {
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
