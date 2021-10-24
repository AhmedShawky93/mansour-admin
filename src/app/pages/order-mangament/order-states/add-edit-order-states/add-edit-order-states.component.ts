import { OrderStatesService } from "./../../../services/order-states.service";
import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, FormArray } from "@angular/forms";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-add-edit-order-states",
  templateUrl: "./add-edit-order-states.component.html",
  styleUrls: ["./add-edit-order-states.component.css"],
})
export class AddEditOrderStatesComponent implements OnInit {
  cityForm: FormGroup;
  sub_states: FormArray;
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataEmit = new EventEmitter();
  @Input("selectDataEdit") selectDataEdit;
  submitting: boolean;
  constructor(
    private orderStatesService: OrderStatesService,
    private formBuilder: FormBuilder
  ) {}

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
      sub_states: this.formBuilder.array([]),
    });
    if (data) {
      data.sub_states.forEach((element) => {
        this.addSubStates(element);
      });
    }
  }

  addSubStates(data): void {
    this.sub_states = this.cityForm.get("sub_states") as FormArray;
    this.sub_states.push(this.createItemSubStates(data));
  }

  createItemSubStates(data): FormGroup {
    return this.formBuilder.group({
      name: new FormControl(data ? data.name : "", Validators.required),
      id: new FormControl(data ? data.id : ""),
    });
  }

  submitForm() {
    if (!this.cityForm.valid) {
      this.markFormGroupTouched(this.cityForm);
      return;
    }
    this.submitting = true;
    const data = this.cityForm.value;
    if (this.selectDataEdit) {
      this.orderStatesService
        .updateOrderStatus(this.selectDataEdit.id, data)
        .subscribe((response: any) => {
          this.submitting = false;

          if (response.code === 200) {
            this.dataEmit.emit(response.data);
            this.closeSideBar();
          }
        });
    }
  }
  removeSubStates(index) {}
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
