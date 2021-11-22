import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ViewAreaComponent } from "./view-area.component";

describe("ViewAreaComponent", () => {
  let component: ViewAreaComponent;
  let fixture: ComponentFixture<ViewAreaComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ViewAreaComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
