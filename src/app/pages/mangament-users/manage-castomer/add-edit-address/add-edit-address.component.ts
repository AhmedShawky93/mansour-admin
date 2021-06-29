import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AreasService } from '@app/pages/services/areas.service';
import { CustomerService } from '@app/pages/services/customer.service';
import { OrdersService } from '@app/pages/services/orders.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-edit-address',
  templateUrl: './add-edit-address.component.html',
  styleUrls: ['./add-edit-address.component.css']
})
export class AddEditAddressComponent implements OnInit, OnChanges {
  
  @Output() closeModalEmit = new EventEmitter();
  @Output() dataAddressEmit = new EventEmitter();
  @Input('selectedCustomer') selectedCustomer;
  @Input('selectedOrder') selectedOrder;
  @Input('selectedAddress') selectedAddress;
  @Input('orderAddress') orderAddress = false;
  
  addressForm: FormGroup;
  cities: any = [];
  areas: any = [];

  constructor(private citiesService: AreasService, private customerService: CustomerService, private toastrService: ToastrService, private orderService: OrdersService) { }

  ngOnInit() {
    this.setupForm(this.selectedAddress);

    this.citiesService.getCities()
      .subscribe((response: any) => {
        this.cities = response.data;
      })
  }

  ngOnChanges() {
    this.setupForm(this.selectedAddress);
  }

  setupForm(data) {
    this.addressForm = new FormGroup({
      name: new FormControl(data ? data.name : '', Validators.required),
      address: new FormControl(data ? data.address : '', Validators.required),
      city_id: new FormControl(data ? data.city_id : '', Validators.required),
      area_id: new FormControl(data ? data.area_id : '', Validators.required),
      landmark: new FormControl(data ? data.landmark : ''),
      floor: new FormControl(data ? data.floor : '', Validators.required),
      apartment: new FormControl(data ? data.apartment : '', Validators.required),
      primary: new FormControl(data ? data.primary : false),
      lat: new FormControl(26.81910634209373),
      lng: new FormControl(30.7979080581665),
    })

    this.onCitySelected();

  }

  submitAddress() {
    if (!this.addressForm.valid) {
      this.markFormGroupTouched(this.addressForm);
      return;
    }

    if (!(this.areas.filter((area) => area.id == this.addressForm.value.area_id).length > 0)){
      this.addressForm.controls.area_id.setValue(this.areas[0].id)
    }

    let address = this.addressForm.value;
    if (this.selectedOrder) {
      // update order address
      this.orderService.updateAddress(this.selectedOrder.id, address)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.closeModal(response.data);
          } else {
            this.toastrService.error(response.message, "Error");       
          }
        });
    } else if (this.selectedAddress) {
      this.customerService.updateAddress(this.selectedCustomer.id, this.selectedAddress.id, address)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.closeModal(response.data);
          } else {
            this.toastrService.error(response.message, "Error");       
          }
        });
    } else {
      this.customerService.createAddress(this.selectedCustomer.id, address)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.closeModal(response.data);
          } else {
            this.toastrService.error(response.message, "Error");       
          }
        });
    }
  }

  onCitySelected() {
    let city_id = this.addressForm.get('city_id').value;

    if (city_id) {
      let ind = this.cities.findIndex(c => c.id == city_id);

      if (ind !== -1) {
        this.areas = this.cities[ind].areas;
      }
    }
  }

  closeModal(data) {
    this.addressForm.reset();
    this.closeModalEmit.emit(data);
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
