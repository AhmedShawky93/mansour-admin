import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ViewCityComponent } from "./view-city.component";

describe("ViewCityComponent", () => {
  let component: ViewCityComponent;
  let fixture: ComponentFixture<ViewCityComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ViewCityComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
