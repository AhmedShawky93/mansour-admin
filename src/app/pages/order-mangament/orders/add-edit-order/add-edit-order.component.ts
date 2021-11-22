import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AreasService } from "@app/pages/services/areas.service";
import { CustomerService } from "@app/pages/services/customer.service";
import { OrdersService } from "@app/pages/services/orders.service";
import { ProductsService } from "@app/pages/services/products.service";
import { SettingService } from "@app/pages/services/setting.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject, concat, of, EMPTY } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
  map,
  delay,
} from "rxjs/operators";

@Component({
  selector: "app-add-edit-order",
  templateUrl: "./add-edit-order.component.html",
  styleUrls: ["./add-edit-order.component.scss"],
})
export class AddEditOrderComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataProductEmit = new EventEmitter();
  @Input("selectedOrder") selectedOrder;
  addresseNames: any[] = [
    { id: 0, name: "Home", name_ar: "المنزل" },
    { id: 1, name: "Work", name_ar: "العمل" },
    { id: 2, name: "Others", name_ar: "أخرى" },
  ];

  customers: any = [];
  addresses: any = [];
  customers$: Observable<any>;
  customersInput$ = new Subject<String>();
  customersLoading: boolean;
  loadingCustomer: boolean;

  products = [];

  orderForm: FormGroup;
  addressForm: FormGroup;
  customerForm: FormGroup;
  deleted_items: any[] = [];
  loading: boolean;
  selectedProductToUpdate: any;
  cities: any = [];
  areas: any = [];
  step: number = 0;
  isDisabledPaymentStepTwo: boolean = true;
  isDisabledPaymentStepThree: boolean = true;
  thirdTrigger: any;
  plan_id: any;
  loadingAddress: boolean = false;
  environmentVariables: any;

  constructor(
    private settingService: SettingService,
    private citiesService: AreasService,
    private customerService: CustomerService,
    private router: Router,
    private productService: ProductsService,
    private ordersService: OrdersService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  onCitySelected() {
    let city_id = this.addressForm.get("city_id").value;

    if (city_id) {
      let ind = this.cities.findIndex((c) => c.id == city_id);

      if (ind !== -1) {
        this.areas = this.cities[ind].areas;
      }
    }
  }

  ngOnInit() {
    this.setStep(0);
    this.setupForm(this.selectedOrder);
    this.getConfig();

    this.citiesService.getCities().subscribe((response: any) => {
      this.cities = response.data;
    });
  }

  public setStep(index: number) {
    this.step = index;
    switch (index) {
      case 0:
        this.isDisabledPaymentStepTwo = true;
        this.isDisabledPaymentStepThree = true;
        break;
      case 1:
        this.isDisabledPaymentStepThree = true;
        this.isDisabledPaymentStepTwo = false;
        break;
      default:
        this.isDisabledPaymentStepThree = false;
        this.thirdTrigger = this.plan_id;
        break;
    }
  }

  ngOnChanges() {
    this.setupForm(this.selectedOrder);
    this.getConfig();
  }

  addCustomer() {
    if (
      this.orderForm.get("has_customer").value == 0 &&
      !this.customerForm.valid
    ) {
      this.markFormGroupTouched(this.customerForm);
      return;
    } else if (
      this.orderForm.get("has_customer").value == 0 &&
      this.customerForm.valid
    ) {
      this.loadingCustomer = true;

      let customer = this.customerForm.value;
      this.customerService
        .createCustomer(customer)
        .subscribe((response: any) => {
          this.loadingCustomer = false;
          if (response.code == 200) {
            this.orderForm.controls["user_id"].setValue(response.data.id);
            this.setStep(1);
          } else {
            this.toastrService.error(response.message, "Error");
          }
        });
    } else if (
      this.orderForm.get("has_customer").value == 1 &&
      this.orderForm.controls["user_id"].valid
    ) {
      this.setStep(1);
    } else if (this.orderForm.get("has_customer").value == 2) {
      this.setStep(1);
    } else {
      this.markFormGroupTouched(this.orderForm);
      this.markFormGroupTouched(this.customerForm);
    }
  }

  submitAddress() {
    this.updateValidaty();
    if (
      this.orderForm.get("has_address").value == 0 &&
      !this.addressForm.valid
    ) {
      this.markFormGroupTouched(this.addressForm);
      return;
    } else if (
      this.orderForm.get("has_address").value == 0 &&
      this.customerForm.valid
    ) {
      this.loadingAddress = true;

      if (
        !(
          this.areas.filter((area) => area.id == this.addressForm.value.area_id)
            .length > 0
        ) &&
        this.areas.length > 0
      ) {
        this.addressForm.controls.area_id.setValue(this.areas[0].id);
      }

      let address = this.addressForm.value;
      if (
        this.orderForm.get("has_address").value == 0 &&
        this.addressForm.valid
      ) {
        this.customerService
          .createAddress(this.orderForm.get("user_id").value, address)
          .subscribe((response: any) => {
            this.loadingAddress = false;
            if (response.code == 200) {
              this.orderForm["controls"]["address_id"].setValue(
                response.data.id
              );
              this.setStep(2);
            } else {
              this.toastrService.error(response.message, "Error");
            }
          });
      }
    } else if (
      this.orderForm.get("has_address").value == 0 &&
      !this.addressForm.valid
    ) {
      this.markFormGroupTouched(this.addressForm);
    } else if (
      this.orderForm.get("has_address").value == 1 &&
      this.customerForm.valid &&
      this.orderForm.get("address_id").value
    ) {
      this.setStep(2);
    }
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

  getConfig() {
    this.settingService.getenvConfig().subscribe((res) => {
      this.environmentVariables = res;
      this.customerForm.controls.phone.setValidators([
        Validators.minLength(
          this.environmentVariables.localization.phone_length
        ),
        Validators.maxLength(
          this.environmentVariables.localization.phone_length
        ),
        Validators.pattern(
          this.environmentVariables.localization.phone_pattern
        ),
      ]);
      this.customerForm.controls.phone.updateValueAndValidity();
      this.customerForm.updateValueAndValidity();
    });
  }

  setupForm(data) {
    this.products = [];
    this.deleted_items = [];

    this.customerForm = new FormGroup({
      name: new FormControl(data ? data.name : ""),
      last_name: new FormControl(data ? data.last_name : ""),
      email: new FormControl(data ? data.email : ""),
      phone: new FormControl(data ? data.phone : ""),
      password: new FormControl(""),
      closed_payment_methods: new FormControl(
        data && data.closed_payment_methods
          ? data.closed_payment_methods.map((c) => c.id)
          : []
      ),
    });

    this.addressForm = new FormGroup({
      name: new FormControl(data ? data.address.name : ""),
      address: new FormControl(data ? data.address.address : ""),
      city_id: new FormControl(data ? data.address.city_id : ""),
      area_id: new FormControl(data ? data.address.area_id : ""),
      landmark: new FormControl(data ? data.address.landmark : ""),
      floor: new FormControl(data ? data.address.floor : ""),
      apartment: new FormControl(data ? data.address.apartment : ""),
      email: new FormControl(data ? data.address.email : ""),
      phone: new FormControl(data ? data.address.phone : ""),
      lat: new FormControl(26.81910634209373),
      lng: new FormControl(30.7979080581665),
    });

    this.orderForm = new FormGroup({
      user_id: new FormControl(
        data && data.user ? data.user.id : "",
        Validators.required
      ),
      address_id: new FormControl(
        data ? data.address.id : "",
        Validators.required
      ),
      payment_method: new FormControl(
        data ? data.payment_method : "",
        Validators.required
      ),
      items: new FormArray([], Validators.required),
      notes: new FormControl(data ? data.notes : ""),
      admin_notes: new FormControl(data ? data.admin_notes : ""),
      overwrite_fees: new FormControl(0),
      delivery_fees: new FormControl(data ? data.delivery_fees : ""),
      has_address: new FormControl(data ? 1 : 0),
      has_customer: new FormControl(data ? 1 : 0),
    });

    if (data) {
      if (data.user) {
        this.spinner.show();
        this.customerService.getCustomer(data.user.id).subscribe((res) => {
          this.spinner.hide();
          this.addresses = res.data.addresses;
        });
      }
      data.items.forEach((item) => {
        const productsInput$ = new Subject<String>();
        let productsLoading = false;
        const products$ = concat(
          of([
            {
              id: item.id,
              name:
                item.product.sku +
                ": " +
                item.product.name +
                ", stock: " +
                item.product.stock,
              stock: item.product.stock,
            },
          ]), // default items
          productsInput$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => (productsLoading = true)),
            switchMap((term) =>
              this.productService
                .searchProducts({ q: term, variant: 1 }, 1)
                .pipe(
                  catchError(() => of([])), // empty list on error
                  tap(() => (productsLoading = false)),
                  map((response: any) => {
                    return response.data.products.map((p) => {
                      return {
                        id: p.id,
                        name: p.sku + ": " + p.name + ", stock: " + p.stock,
                        stock: p.stock,
                      };
                    });
                  })
                )
            )
          )
        );
        this.products.push({
          products$: products$,
          productsInput$: productsInput$,
          productsLoading: productsLoading,
        });

        (this.orderForm.get("items") as FormArray).push(
          new FormGroup({
            id: new FormControl(item.id, Validators.required),
            amount: new FormControl(item.amount, [
              Validators.required,
              Validators.min(1),
              Validators.max(item.product.stock),
            ]),
          })
        );
      });
    }

    if (data && !data.user) {
      this.orderForm.get("has_customer").setValue(2);
      this.orderForm.get("has_address").setValue(0);
      this.updateValidaty();
      // this.addressForm.controls.name.setValidators([Validators.required]);
      // this.addressForm.controls.name.setValidators([Validators.required]);
      // this.addressForm.controls.city_id.setValidators([Validators.required]);
      // this.addressForm.controls.area_id.setValidators([Validators.required]);
      // this.addressForm.controls.floor.setValidators([Validators.required]);
      // this.addressForm.controls.apartment.setValidators([Validators.required]);
      // this.addressForm.controls.email.setValidators([Validators.required]);
      // this.addressForm.controls.phone.setValidators([
      //   Validators.minLength(
      //     this.environmentVariables.localization.phone_length
      //   ),
      //   Validators.maxLength(
      //     this.environmentVariables.localization.phone_length
      //   ),
      //   Validators.pattern(
      //     this.environmentVariables.localization.phone_pattern
      //   ),
      // ]);
      // this.orderForm.get("has_customer").updateValueAndValidity();
      // this.orderForm.get("has_address").updateValueAndValidity();
      // this.addressForm.controls.name.updateValueAndValidity();
      // this.addressForm.controls.name.updateValueAndValidity();
      // this.addressForm.controls.city_id.updateValueAndValidity();
      // this.addressForm.controls.area_id.updateValueAndValidity();
      // this.addressForm.controls.floor.updateValueAndValidity();
      // this.addressForm.controls.apartment.updateValueAndValidity();
      // this.addressForm.controls.email.updateValueAndValidity();
      // this.addressForm.controls.phone.updateValueAndValidity();
    } else {
      // this.addressForm.controls.name.clearValidators();
      // this.addressForm.controls.name.clearValidators();
      // this.addressForm.controls.city_id.clearValidators();
      // this.addressForm.controls.area_id.clearValidators();
      // this.addressForm.controls.floor.clearValidators();
      // this.addressForm.controls.apartment.clearValidators();
      // this.addressForm.controls.email.clearValidators();
      // this.addressForm.controls.phone.clearValidators();
    }

    this.customers$ = concat(
      of(data ? [data.user] : []), // default items
      this.customersInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.customersLoading = true)),
        switchMap((term) =>
          this.customerService.searchCustomers(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.customersLoading = false)),
            map((response: any) => {
              this.customers = response.data.customers;
              return response.data.customers.map((c) => {
                return {
                  id: c.id,
                  name:
                    c.id +
                    ": " +
                    c.name +
                    (c.active == 0 ? ": dectivated" : ""),
                };
              });
            })
          )
        )
      )
    );
  }

  updateValidaty() {
    if (!this.orderForm.controls.has_address.value) {
      this.orderForm.controls.address_id.setValidators([]);
      this.addressForm.controls.name.setValidators([Validators.required]);
      this.addressForm.controls.address.setValidators([Validators.required]);
      this.addressForm.controls.city_id.setValidators([Validators.required]);
      this.addressForm.controls.area_id.setValidators([Validators.required]);
      this.addressForm.controls.floor.setValidators([Validators.required]);
      this.addressForm.controls.apartment.setValidators([Validators.required]);
      this.orderForm.controls.address_id.updateValueAndValidity();
      this.addressForm.controls.name.updateValueAndValidity();
      this.addressForm.controls.address.updateValueAndValidity();
      this.addressForm.controls.city_id.updateValueAndValidity();
      this.addressForm.controls.area_id.updateValueAndValidity();
      this.addressForm.controls.floor.updateValueAndValidity();
      this.addressForm.controls.apartment.updateValueAndValidity();
    } else {
      this.orderForm.controls.address_id.setValidators([Validators.required]);
      this.addressForm.controls.name.setValidators([]);
      this.addressForm.controls.address.setValidators([]);
      this.addressForm.controls.city_id.setValidators([]);
      this.addressForm.controls.area_id.setValidators([]);
      this.addressForm.controls.floor.setValidators([]);
      this.addressForm.controls.apartment.setValidators([]);
      this.orderForm.controls.address_id.updateValueAndValidity();
      this.addressForm.controls.name.updateValueAndValidity();
      this.addressForm.controls.address.updateValueAndValidity();
      this.addressForm.controls.city_id.updateValueAndValidity();
      this.addressForm.controls.area_id.updateValueAndValidity();
      this.addressForm.controls.floor.updateValueAndValidity();
      this.addressForm.controls.apartment.updateValueAndValidity();
    }
    this.unmarkFormGroupTouched(this.addressForm);
  }

  updateCustomerValidaty() {
    if (!this.orderForm.controls.has_customer.value) {
      this.customerForm.controls.name.setValidators([Validators.required]);
      this.orderForm.controls.user_id.setValidators([]);
      this.customerForm.controls.last_name.setValidators([Validators.required]);
      this.customerForm.controls.email.setValidators([
        Validators.required,
        Validators.email,
      ]);
      this.customerForm.controls.phone.setValidators([
        Validators.required,
        this.regexValidator(new RegExp("^\\d+$"), { numbers: "Numeric Only" }),
        this.regexValidator(new RegExp("^01"), {
          startWith: "Must Start With 01",
        }),
        this.regexValidator(new RegExp("^[0-9]+$"), {
          englishNumbers: "English Numeric",
        }),
        Validators.minLength(11),
        Validators.maxLength(11),
      ]);
      this.customerForm.controls.password.setValidators([Validators.required]);
      this.customerForm.controls.name.updateValueAndValidity();
      this.orderForm.controls.user_id.updateValueAndValidity();
      this.customerForm.controls.last_name.updateValueAndValidity();
      this.customerForm.controls.email.updateValueAndValidity();
      this.customerForm.controls.phone.updateValueAndValidity();
      this.customerForm.controls.password.updateValueAndValidity();
    } else {
      this.orderForm.controls.address_id.setValidators([Validators.required]);
      this.orderForm.controls.user_id.setValidators([Validators.required]);
      this.customerForm.controls.name.setValidators([]);
      this.customerForm.controls.last_name.setValidators([]);
      this.customerForm.controls.email.setValidators([]);
      this.customerForm.controls.phone.setValidators([]);
      this.customerForm.controls.password.setValidators([]);
      this.orderForm.controls.user_id.updateValueAndValidity();
      this.customerForm.controls.name.updateValueAndValidity();
      this.customerForm.controls.last_name.updateValueAndValidity();
      this.customerForm.controls.email.updateValueAndValidity();
      this.customerForm.controls.phone.updateValueAndValidity();
      this.customerForm.controls.password.updateValueAndValidity();
    }

    this.unmarkFormGroupTouched(this.customerForm);
    this.unmarkFormGroupTouched(this.orderForm);
  }

  updateAmountMax(item, index) {
    if (item) {
      this.orderForm
        .get("items")
        ["controls"][index].controls.amount.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(item.stock),
        ]);
    }
  }

  addProduct() {
    let productsInput$ = new Subject<String>();
    let productsLoading = false;
    let products$ = concat(
      of([]), // default items
      productsInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (productsLoading = true)),
        switchMap((term) =>
          this.productService.searchProducts({ q: term, variant: 1 }, 1).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (productsLoading = false)),
            map((response: any) => {
              return response.data.products.map((p) => {
                return {
                  id: p.id,
                  name: p.sku + ": " + p.name + ", stock: " + p.stock,
                };
              });
            })
          )
        )
      )
    );
    this.products.push({
      products$: products$,
      productsInput$: productsInput$,
      productsLoading: productsLoading,
    });

    (this.orderForm.get("items") as FormArray).push(
      new FormGroup({
        id: new FormControl("", Validators.required),
        amount: new FormControl("", [Validators.required, Validators.min(1)]),
      })
    );
  }

  get productsData() {
    return <FormArray>this.orderForm.get("items");
  }

  removeProduct(index, product_id) {
    this.deleted_items.push(product_id);

    this.products.splice(index, 1);

    (this.orderForm.get("items") as FormArray).removeAt(index);
  }

  addToDeletetItems() {
    this.deleted_items.push(this.selectedProductToUpdate);
  }

  updateSelecteItem(product) {
    this.selectedProductToUpdate = product;
  }

  selectCustomerAddresses() {
    let user_id = this.orderForm.get("user_id").value;
    if (user_id) {
      let ind = this.customers.findIndex((c) => c.id == user_id);
      this.orderForm.controls.address_id.setValue(null);
      if (ind !== -1) {
        this.addresses = this.customers[ind].addresses;
      }
    }
  }

  createCustomer() {
    this.router.navigate(["/pages/manage-customer"], {
      queryParams: { fromOrder: true },
    });
  }

  createAddress(customerId) {
    localStorage.setItem(
      "selectedCustomer",
      JSON.stringify(this.customers.find((name) => name.id === customerId))
    );
    this.router.navigate(["/pages/manage-customer"], {
      queryParams: { fromOrderCreateAddress: true, customerId },
    });
  }

  submitOrder() {
    if (!this.orderForm.valid) {
      this.markFormGroupTouched(this.orderForm);
      return;
    }

    let order = this.orderForm.value;

    if (this.selectedOrder) {
      this.loading = true;
      order.deleted_items = this.deleted_items;
      this.ordersService
        .updateItems(this.selectedOrder.id, order)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.closeSideBar(response.data);
            this.addresses = [];
            this.customers$ = EMPTY.pipe(delay(1000));
          } else {
            this.toastrService.error(response.message, "Error");
          }
          this.loading = false;
        });
    } else {
      this.loading = true;
      this.ordersService.createOrder(order).subscribe((response: any) => {
        if (response.code == 200) {
          this.closeSideBar(response.data);
          this.addresses = [];
          this.customers$ = EMPTY.pipe(delay(1000));
        } else {
          this.toastrService.error(response.message, "Error");
        }
        this.loading = false;
      });
    }
  }

  closeSideBar(data = null) {
    this.customerForm.reset();
    this.addressForm.reset();
    this.orderForm.reset();
    this.loading = false;
    this.deleted_items = [];
    this.addresses = [];
    this.customers$ = concat(
      of([]), // default items
      this.customersInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.customersLoading = true)),
        switchMap((term) =>
          this.customerService.searchCustomers(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.customersLoading = false)),
            map((response: any) => {
              this.customers = response.data.customers;
              return response.data.customers.map((c) => {
                return {
                  id: c.id,
                  name:
                    c.id +
                    ": " +
                    c.name +
                    (c.active == 0 ? ": dectivated" : ""),
                };
              });
            })
          )
        )
      )
    );
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

  private unmarkFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsUntouched();

      if (control.controls) {
        this.unmarkFormGroupTouched(control);
      }
    });
  }

  formControlValidator(formGroup, controlName, err) {
    if (
      formGroup.controls[controlName].invalid &&
      (formGroup.controls[controlName].touched ||
        formGroup.controls[controlName].dirty)
    ) {
      if (formGroup.controls[controlName].errors) {
        return formGroup.controls[controlName].errors[err];
      }
    }
  }
}
