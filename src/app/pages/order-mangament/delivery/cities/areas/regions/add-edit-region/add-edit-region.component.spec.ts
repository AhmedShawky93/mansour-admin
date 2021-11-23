import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { AddEditRegionComponent } from "./add-edit-region.component";

describe("AddEditRegionComponent", () => {
  let component: AddEditRegionComponent;
  let fixture: ComponentFixture<AddEditRegionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AddEditRegionComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
