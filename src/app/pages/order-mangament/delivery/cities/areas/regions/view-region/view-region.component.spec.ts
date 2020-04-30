import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRegionComponent } from './view-region.component';

describe('ViewRegionComponent', () => {
  let component: ViewRegionComponent;
  let fixture: ComponentFixture<ViewRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
