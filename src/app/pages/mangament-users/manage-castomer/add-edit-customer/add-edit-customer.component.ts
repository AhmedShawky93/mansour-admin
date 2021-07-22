import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '@app/pages/services/customer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.component.html',
  styleUrls: ['./add-edit-customer.component.css']
})
export class AddEditCustomerComponent implements OnInit {

  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataCustomerEmit = new EventEmitter();
  @Input('selectedCustomer') selectedCustomer;
  customerForm: FormGroup;

  constructor(private customerService: CustomerService, private toastrService: ToastrService) { }

  ngOnInit() {
    this.setupForm(this.selectedCustomer);
  }

  ngOnChanges() {
    this.setupForm(this.selectedCustomer);
  }

  setupForm(data) {
    this.customerForm = new FormGroup({
      name: new FormControl(data ? data.name : '', Validators.required),
      last_name: new FormControl(data ? data.last_name : '', Validators.required),
      email: new FormControl(data ? data.email : '', [Validators.required, Validators.email]),
      phone: new FormControl(data ? data.phone : '', Validators.required),
      password: new FormControl('', this.selectedCustomer ? [] : Validators.required),
      closed_payment_methods: new FormControl(data ? data.closed_payment_methods.map(c => c.id) : []),
    });
  }

  submitCustomer() {
    if (!this.customerForm.valid) {
      this.markFormGroupTouched(this.customerForm);
      return;
    }

    let customer = this.customerForm.value;
    if (this.selectedCustomer) {
      this.customerService.updateCustomer(this.selectedCustomer.id, customer)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.closeSideBar(response.data);
          } else {
            this.toastrService.error(response.message, "Error");       
          }
        });
    } else {
      this.customerService.createCustomer(customer)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.closeSideBar(response.data);
          } else {
            this.toastrService.error(response.message, "Error");       
          }
        });
    }
  }

  closeSideBar(data = null) {
    this.customerForm.reset();
    this.closeSideBarEmit.emit(data);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  formControlValidator(formGroup, controlName, err) {
    if (formGroup.controls[controlName].invalid && (formGroup.controls[controlName].touched || formGroup.controls[controlName].dirty)) {
      if (formGroup.controls[controlName].errors) {
        return formGroup.controls[controlName].errors[err];
      }
    }
  }

}
