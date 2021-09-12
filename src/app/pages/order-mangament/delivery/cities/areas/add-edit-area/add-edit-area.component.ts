import { AreasService } from "@app/pages/services/areas.service";
import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormGroup, FormControl, FormArray, FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";
@Component({
  selector: "app-add-edit-area",
  templateUrl: "./add-edit-area.component.html",
  styleUrls: ["./add-edit-area.component.css"],
})
export class AddEditAreaComponent implements OnInit {
  cityForm: FormGroup;
  ranges: FormArray;
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataEmit = new EventEmitter();
  @Input("selectDataEdit") selectDataEdit;
  @Input("idParent") idParent;

  constructor(private _areaService: AreasService, private formbuilder: FormBuilder) { }

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
        data ? data.delivery_fees : 0),
      fees_type: new FormControl(data ? data.fees_type : 1),

      fees_range: new FormArray([])

      // apply_with_other: new FormControl(false),
    });
    if (data) {
      this.selectTypePrice(data.fees_type)
      data.fees_range.forEach((element) => {
        this.addRangeForm(element);
      });
    }
  }

  addRangeForm(data): void {
    this.ranges = this.cityForm.get("fees_range") as FormArray;
    this.ranges.push(this.createItem(data));
  }
  createItem(data): FormGroup {
    return this.formbuilder.group({
      fees: new FormControl(data ? data.fees : "", [Validators.required]),
      weight_from: new FormControl(data ? data.weight_from : "", [Validators.required]),
      weight_to: new FormControl(data ? data.weight_to : "", [Validators.required]),
    });
  }
  removeRangeForm(index) {
    this.ranges.removeAt(index);
  }
  selectTypePrice(type) {
    if (type == 1) {
      // reset data array form
      // const control = <FormArray>this.cityForm.controls['fees_range'];
      // for (let i = control.length - 1; i >= 0; i--) {
      //   control.removeAt(i)
      // }

      this.cityForm.get('fees_range').clearValidators();
      this.cityForm.get('delivery_fees').setValidators([Validators.required])
    } else if (type == 2) {
      if (this.selectDataEdit == null) this.addRangeForm(null)
      this.cityForm.get('delivery_fees').setValue('');
      this.cityForm.get('fees_range').setValidators([Validators.minLength(1), Validators.required]);
      this.cityForm.get('delivery_fees').clearValidators()
    }
    this.cityForm.get('fees_range').updateValueAndValidity()
    this.cityForm.get('delivery_fees').updateValueAndValidity()
  }

  submitForm() {
    if (!this.cityForm.valid) {
      this.markFormGroupTouched(this.cityForm);
      return;
    }
    const data = this.cityForm.value;
    if (data.fees_type == '1') {
      delete data.fees_range
    } else if (data.fees_type == '2') {
      delete data.delivery_fees
    }
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
