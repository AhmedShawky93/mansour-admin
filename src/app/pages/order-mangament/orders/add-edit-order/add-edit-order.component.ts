import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomerService } from '@app/pages/services/customer.service';
import { OrdersService } from '@app/pages/services/orders.service';
import { ProductsService } from '@app/pages/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, concat, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-order',
  templateUrl: './add-edit-order.component.html',
  styleUrls: ['./add-edit-order.component.css']
})
export class AddEditOrderComponent implements OnInit {

  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataProductEmit = new EventEmitter();
  @Input('selectedOrder') selectedOrder;

  customers: any = [];
  addresses: any = [];
  customers$: Observable<any>;
  customersInput$ = new Subject<String>();
  customersLoading: boolean;

  products = [];

  orderForm: FormGroup;
  deleted_items: any[] = [];
  
  constructor(private customerService: CustomerService, private productService: ProductsService, private ordersService: OrdersService, private toastrService: ToastrService) { }

  ngOnInit() {
    this.customers$ = concat(
      of([]), // default items
      this.customersInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => this.customersLoading = true),
        switchMap(term => this.customerService.searchCustomers(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.customersLoading = false),
          map((response: any) => {
            this.customers = response.data.customers;
            return response.data.customers.map(c => {
              return {
                id: c.id,
                name: c.id + ": " + c.name
              }
            })
          })
        ))
      )
    );

    this.orderForm = new FormGroup({
      user_id: new FormControl('', Validators.required),
      address_id: new FormControl('', Validators.required),
      payment_method: new FormControl('', Validators.required),
      items: new FormArray([], Validators.required),
      notes: new FormControl(''),
      admin_notes: new FormControl(''),
      overwrite_fees: new FormControl(0),
      delivery_fees: new FormControl(0),
    });
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
                  name: p.sku + ": " + p.name,
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
      productsLoading: productsLoading
    });

    (this.orderForm.get('items') as FormArray).push(new FormGroup({
      id: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required)
    }))
  }

  removeProduct(index) {
    this.products.splice(index, 1);

    (this.orderForm.get("items") as FormArray).removeAt(index);
  }

  selectCustomerAddresses() {
    let user_id = this.orderForm.get('user_id').value;
    if (user_id) {
      let ind = this.customers.findIndex(c => c.id == user_id);

      if (ind !== -1) {
        this.addresses = this.customers[ind].addresses;
      }
    } 
  }

  submitOrder() {
    if (!this.orderForm.valid) {
      console.log("INVALID FORM");
      this.markFormGroupTouched(this.orderForm);
      return;
    }

    let order = this.orderForm.value;
    console.log(order);
    this.ordersService.createOrder(order)
      .subscribe((response: any) => {
        console.log(response);
        if (response.code == 200) {
          this.closeSideBar(response.data);
        } else {
          this.toastrService.error(response.message, "Error");       
        }
      });
  }

  closeSideBar(data = null) {
    this.orderForm.reset();
    this.deleted_items = [];
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
