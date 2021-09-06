import { AreasService } from "./../../../../services/areas.service";
import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
@Component({
  selector: "app-add-edit-city",
  templateUrl: "./add-edit-city.component.html",
  styleUrls: ["./add-edit-city.component.css"],
})
export class AddEditCityComponent implements OnInit {
  cityForm: FormGroup;
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataEmit = new EventEmitter();
  @Input("selectDataEdit") selectDataEdit;
  constructor(private _areaService: AreasService) {}

  ngOnInit() {
    this.getForm(this.selectDataEdit);
  }
  ngOnChanges(): void {
    this.getForm(this.selectDataEdit);
  }
  getForm(data) {
    this.cityForm = new FormGroup({
      name: new FormControl(data ? data.name : "", Validators.required),
      name_ar: new FormControl(data ? data.name_ar : "", Validators.required),
      delivery_fees: new FormControl(
        data ? data.delivery_fees : 0,
        Validators.required
      ),
      range: new FormControl(data ? data.range : false),
      from: new FormControl(data ? data.from : "",Validators.pattern('\\d*(\\.\\d{1,2})?$')),
      to: new FormControl(data ? data.to : "",Validators.pattern('\\d*(\\.\\d{1,2})?$')),

      // apply_with_other: new FormControl(false),
    });
  }

  submitForm() {
    if (!this.cityForm.valid) {
      this.markFormGroupTouched(this.cityForm);
      return;
    }
    const data = this.cityForm.value;
    if (this.selectDataEdit) {
      this._areaService
        .updateCity(this.selectDataEdit.id, data)
        .subscribe((response: any) => {
          if (response.code === 200) {
            this.dataEmit.emit(response.data);
            this.closeSideBar();
          }
        });
    } else {
      this._areaService.createCity(data).subscribe((response: any) => {
        if (response.code === 200) {
          this.dataEmit.emit(response.data);
          this.closeSideBar();
        }
      });
    }
  }
  closeSideBar() {
    this.closeSideBarEmit.emit();
    if (!this.selectDataEdit) {
      this.cityForm.reset();
    }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
