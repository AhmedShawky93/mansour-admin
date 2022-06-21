import { UploadFilesService } from "./../../../../services/upload-files.service";
import { Component, OnInit } from "@angular/core";
import { PromosService } from "@app/pages/services/promos.service";
import "rxjs/add/operator/take";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  NgForm,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import * as moment from "moment";
import { CustomerService } from "@app/pages/services/customer.service";
import { Subject, of, Observable, concat } from "rxjs";
import {
  switchMap,
  catchError,
  debounceTime,
  distinctUntilChanged,
  tap,
  map,
} from "rxjs/operators";
import { ListsService } from "@app/pages/services/lists.service";
import { ProductsService } from "@app/pages/services/products.service";
import { PromotionsService } from "@app/pages/services/promotions.service";

@Component({
  selector: "app-add-category",
  templateUrl: "./add-offer.component.html",
  styleUrls: ["./add-offer.component.css"],
})
export class AddOfferComponent implements OnInit {
  today: Date;
  date: any;
  myMoment: moment.Moment;
  public promo: any = {
    name: "",
    recurrence: "",
    description: "",
    type: "",
    amount: "",
    max_amount: "",
    expiration_date: "",
    id: Number,
    minimum_amount: "",
    customer_phones: "",
    target_type: "null",
    list_id: "",
    first_order: false,
  };
  paymentMethods: any;
  newPromo;
  customers: any = [];
  customers$: Observable<any>;
  customersInput$ = new Subject<String>();
  customersLoading: boolean;
  selectFile: File;
  lists: any;
  submitting: boolean;
  incentives = [];
  constructor(
    private promoService: PromosService,
    private toastrService: ToastrService,
    private customerService: CustomerService,
    private router: Router,
    private uploadFile: UploadFilesService,
    private listsService: ListsService,
    private promotionService: PromotionsService,
    private productsService: ProductsService
  ) {}

  // add Promo
  addpromo(promo) {
    if (!this.newPromo.valid) {
      this.markFormGroupTouched(this.newPromo);
      return;
    }
    promo.expiration_date = moment(this.newPromo.get("date").value).format(
      "YYYY-MM-DD"
    );
    promo.customer_ids = this.newPromo.get("customers").value;
    this.submitting = true;
    this.promoService.createPromos(promo).subscribe((response: any) => {
      this.submitting = false;
      if (response.code == 200) {
        this.router.navigate(["/pages/promocodes"]);
      } else {
        this.toastrService.error(response.message);
      }
    });
  }
  getIncentives() {
    this.promotionService.getIncentivs().subscribe((response: any) => {
      this.incentives = response.data;
      this.incentives.map((item) => {
        item.incentive_desc = item.incentive_desc + "-" + item.incentive_id;
      });
    });
  }
  importExcel(event) {
    let fileName = <File>event.target.files[0];
    this.productsService.import(fileName, "8").subscribe((response: any) => {
      console.log(response);
      if (response.code == 200) {
        this.toastrService.success("File uploaded successfully");
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

  ngOnInit() {
    this.getIncentives();
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 1);

    // this.customerService.getCustomersSimple()
    //   .subscribe((respnose: any) => {
    //     this.customers = respnose.data;
    //   });

    this.listsService.getLists({}).subscribe((response: any) => {
      this.lists = response.data;
    });

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

    this.newPromo = new FormGroup({
      incentive_id: new FormControl(""),
      promoName: new FormControl("", [
        Validators.required,
        Validators.pattern(/[A-Za-z0-9]+$/),
      ]),
      description: new FormControl("", Validators.required),
      recurrence: new FormControl("", Validators.required),
      promotype: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
      max_amount: new FormControl(""),
      payment_methods: new FormControl(""),
      date: new FormControl("", Validators.required),
      customers: new FormControl(),
      minimum_amount: new FormControl(""),
      customer_phones: new FormControl(""),
      first_order: new FormControl(false),
      list_id: new FormControl(""),
      target_type: new FormControl("null"),
    });

    this.getPaymentMethods();
  }

  getPaymentMethods() {
    this.promoService.getPaymentMethods().subscribe((rep) => {
      if (rep.code === 200) {
        this.paymentMethods = rep.data.filter((item) => item.active == "1");
      }
    });
  }
  typeCustmerSelect(event) {
    if (this.promo.target_type == "1") {
      this.newPromo.get("customer_phones").setValue("");
      this.promo.customer_phones = "";
    } else {
      this.newPromo.get("customers").setValue("");
      this.promo.customers = "";
    }
  }
  changeTypePromo(event) {
    if (event.target.value == "3") {
      this.newPromo.get("amount").clearValidators();
      this.newPromo.get("amount").updateValueAndValidity();
    } else {
      this.newPromo.get("amount").setValidators([Validators.required]);
      this.newPromo.get("amount").updateValueAndValidity();
    }
  }
}
