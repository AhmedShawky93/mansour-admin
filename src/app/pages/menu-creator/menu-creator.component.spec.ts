import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCreatorComponent } from './menu-creator.component';

describe('MenuCreatorComponent', () => {
  let component: MenuCreatorComponent;
  let fixture: ComponentFixture<MenuCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
