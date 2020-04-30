import { OrderStatesService } from './../../../services/order-states.service';
 import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";

@Component({
  selector: 'app-add-edit-order-states',
  templateUrl: './add-edit-order-states.component.html',
  styleUrls: ['./add-edit-order-states.component.css']
})
export class AddEditOrderStatesComponent implements OnInit {
  cityForm: FormGroup;
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataEmit = new EventEmitter();
  @Input("selectDataEdit") selectDataEdit;
  constructor(private orderStatesService: OrderStatesService) {}

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
      this.orderStatesService
        .updateOrderStatus(this.selectDataEdit.id, data)
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
