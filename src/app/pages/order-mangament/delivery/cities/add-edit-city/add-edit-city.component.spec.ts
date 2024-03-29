import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { AddEditCityComponent } from "./add-edit-city.component";

describe("AddEditCityComponent", () => {
  let component: AddEditCityComponent;
  let fixture: ComponentFixture<AddEditCityComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AddEditCityComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
