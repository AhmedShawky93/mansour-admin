import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StaticPagesComponent } from './static-pages.component';

describe('StaticPagesComponent', () => {
  let component: StaticPagesComponent;
  let fixture: ComponentFixture<StaticPagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
