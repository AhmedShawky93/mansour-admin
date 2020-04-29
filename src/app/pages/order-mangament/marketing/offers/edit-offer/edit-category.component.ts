import { Component, OnInit } from "@angular/core";
import { PromosService } from "@app/pages/services/promos.service";
import { Router, ActivatedRoute } from "@angular/router";
import "rxjs/add/operator/take";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  NgForm,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { concat, of, Observable, Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
  map,
} from "rxjs/operators";
import { CustomerService } from "@app/pages/services/customer.service";

@Component({
  selector: "app-edit-category",
  templateUrl: "./edit-offer.component.html",
  styleUrls: ["./edit-offer.component.css"],
})
export class EditOfferComponent implements OnInit {
  today: Date;
  editDate: any;
  id;
  promo: any = {};
  editForm: any;
  promos: any;
  customers: any = [];
  customers$: Observable<any>;
  customersInput$ = new Subject<String>();
  customersLoading: boolean;
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private promoService: PromosService,
    private _formBuilder: FormBuilder,
    private customerService: CustomerService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.editForm = this._formBuilder.group({
      editName: ["", Validators.required],
      editType: ["", Validators.required],
      editAmount: ["", Validators.required],
      editDescription: ["", Validators.required],
      editDate: ["", Validators.required],
      maxAmount: [""],
      minimum_amount: [""],
      customer_phones: [""],
      first_order: [false],
      recurrence: ["", Validators.required],
      customers: [],
    });

    this.today = new Date();
    this.today.setDate(this.today.getDate() - 1);

    this.activeRoute.params.subscribe((params) => {
      let id = params["id"];
      this.promoService.getPromo(id).subscribe((response: any) => {
        this.promo = response.data;
        this.customers$ = concat(
          of(
            response.data.targets.map((customer) => {
              return {
                id: customer.id,
                name: customer.id + ": " + customer.name,
              };
            })
          ), // default items
          this.customersInput$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => (this.customersLoading = true)),
            switchMap((term) =>
              this.customerService.searchCustomers(term).pipe(
                catchError(() => of([])), // empty list on error
                tap(() => (this.customersLoading = false)),
                map((response: any) => {
                  return response.data.customers.map((c) => {
                    return {
                      id: c.id,
                      name: c.id + ": " + c.name,
                    };
                  });
                })
              )
            )
          )
        );
        this.editForm
          .get("customers")
          .setValue(response.data.targets.map((c) => c.id));
        this.promo.customers = response.data.targets.map((c) => c.id);
        this.editForm
          .get("editDate")
          .setValue(new Date(this.promo.expiration_date));
      });
    });
  }

  updatePromo(promo) {
    if (!this.editForm.valid) {
      this.markFormGroupTouched(this.editForm);
      return;
    }
    promo.expiration_date = moment(this.editForm.get("editDate").value).format(
      "YYYY-MM-DD"
    );
    promo.customer_ids = this.editForm.get("customers").value;

    this.promoService.updatePromos(promo).subscribe((response: any) => {
      if (response.code == 200) {
        this.router.navigate(["/pages/promocodes"]);
      } else {
        this.toastrService.error(response.message);
      }
    });
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
