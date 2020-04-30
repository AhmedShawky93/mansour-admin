import { AreasService } from "@app/pages/services/areas.service";
import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
@Component({
  selector: "app-add-edit-area",
  templateUrl: "./add-edit-area.component.html",
  styleUrls: ["./add-edit-area.component.css"],
})
export class AddEditAreaComponent implements OnInit {
  cityForm: FormGroup;
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataEmit = new EventEmitter();
  @Input("selectDataEdit") selectDataEdit;
  @Input("idParent") idParent;
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
        .updateArea(this.idParent, data, this.selectDataEdit.id)
        .subscribe((response: any) => {
          if (response.code === 200) {
            this.dataEmit.emit(response.data);
            this.closeSideBar();
          }
        });
    } else {
      this._areaService
        .createArea(this.idParent, data)
        .subscribe((response: any) => {
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
