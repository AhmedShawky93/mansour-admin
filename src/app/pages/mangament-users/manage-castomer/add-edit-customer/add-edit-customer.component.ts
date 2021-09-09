import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AreasService } from '@app/pages/services/areas.service';
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
  cities: any = [];
  areas: any = [];
  addresseNames: any[] = [{ id: 0, name: 'Home', name_ar: "المنزل" }, { id: 1, name: 'Work', name_ar: "العمل" }, { id: 2, name: "Others", name_ar: "أخرى" }]

  constructor(private customerService: CustomerService, private toastrService: ToastrService, private citiesService: AreasService) { }

  ngOnInit() {
    this.setupForm(this.selectedCustomer);
    this.citiesService.getCities()
      .subscribe((response: any) => {
        this.cities = response.data;
      })
  }

  onCitySelected() {
    let city_id = this.customerForm.controls.address.get('city_id').value;

    if (city_id) {
      let ind = this.cities.findIndex(c => c.id == city_id);

      if (ind !== -1) {
        this.areas = this.cities[ind].areas;
      }
    }
  }

  ngOnChanges() {
    this.setupForm(this.selectedCustomer);
  }

  regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  setupForm(data) {
    this.customerForm = new FormGroup({
      name: new FormControl(data ? data.name : '', Validators.required),
      last_name: new FormControl(data ? data.last_name : '', Validators.required),
      email: new FormControl(data ? data.email : '', [Validators.required, Validators.email]),
      has_address: new FormControl(data ? data.has_address : false),
      address: new FormGroup({
        name: new FormControl(data ? data.name : ''),
        address: new FormControl(data ? data.address : ''),
        city_id: new FormControl(data ? data.city_id : ''),
        area_id: new FormControl(data ? data.area_id : ''),
        landmark: new FormControl(data ? data.landmark : ''),
        floor: new FormControl(data ? data.floor : ''),
        apartment: new FormControl(data ? data.apartment : ''),
      }),
      phone: new FormControl(data ? data.phone : '', [
        Validators.required,
        /*Validators.pattern(numberReg),*/
        this.regexValidator(new RegExp('^\\d+$'), { 'numbers': 'Numeric Only' }),
        this.regexValidator(new RegExp('^01'), { 'startWith': 'Must Start With 01' }),
        this.regexValidator(new RegExp('^[0-9]+$'), { 'englishNumbers': 'English Numeric' }),
        Validators.minLength(11),
        Validators.maxLength(11)]),
      password: new FormControl('', this.selectedCustomer ? [] : Validators.required),
      closed_payment_methods: new FormControl(data ? data.closed_payment_methods.map(c => c.id) : []),
    });
  }

  updateValidaty() {
    if (this.customerForm.controls.has_address.value) {
      this.customerForm.controls.address['controls'].name.setValidators([Validators.required]);
      this.customerForm.controls.address['controls'].address.setValidators([Validators.required]);
      this.customerForm.controls.address['controls'].city_id.setValidators([Validators.required]);
      this.customerForm.controls.address['controls'].area_id.setValidators([Validators.required]);
      this.customerForm.controls.address['controls'].floor.setValidators([Validators.required]);
      this.customerForm.controls.address['controls'].apartment.setValidators([Validators.required]);
    } else {
      this.customerForm.controls.address['controls'].name.setValidators([]);
      this.customerForm.controls.address['controls'].address.setValidators([]);
      this.customerForm.controls.address['controls'].city_id.setValidators([]);
      this.customerForm.controls.address['controls'].area_id.setValidators([]);
      this.customerForm.controls.address['controls'].floor.setValidators([]);
      this.customerForm.controls.address['controls'].apartment.setValidators([]);
    }
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
