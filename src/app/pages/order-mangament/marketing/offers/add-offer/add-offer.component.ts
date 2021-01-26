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
    list_id: '',
    first_order: false,
  };
  paymentMethods:any;
  newPromo;
  customers: any = [];
  customers$: Observable<any>;
  customersInput$ = new Subject<String>();
  customersLoading: boolean;
  selectFile: File;
  lists: any;
  constructor(
    private promoService: PromosService,
    private toastrService: ToastrService,
    private customerService: CustomerService,
    private router: Router,
    private uploadFile: UploadFilesService,
    private listsService: ListsService
  ) {}

  // add Promo
  addpromo(promo) {
    console.log(promo);
    if (!this.newPromo.valid) {
      this.markFormGroupTouched(this.newPromo);
      return;
    }
    promo.expiration_date = moment(this.newPromo.get("date").value).format(
      "YYYY-MM-DD"
    );
    promo.customer_ids = this.newPromo.get("customers").value;

    this.promoService.createPromos(promo).subscribe((response: any) => {
      if (response.code == 200) {
        this.router.navigate(["/pages/promocodes"]);
      } else {
        this.toastrService.error(response.message);
      }
    });
  }
  onImageSelected(data, event) {
    this.selectFile = <File>event.target.files[0];
    this.uploadFile.uploadFile(this.selectFile).subscribe((response: any) => {
      if (response.body) {
        console.log(response);
        data = response.body.data.filePath;
        this.promo.customer_phones = response.body.data.filePath;
        // this.toastrService.success(response.message);
      } else {
        // this.toastrService.error(response.message);
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
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 1);

    // this.customerService.getCustomersSimple()
    //   .subscribe((respnose: any) => {
    //     this.customers = respnose.data;
    //   });

    this.listsService.getLists({})
      .subscribe((response: any) => {
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
      list_id: new FormControl(''),
      target_type: new FormControl("null"),
    });

    this.getPaymentMethods()
  }

  getPaymentMethods(){
    this.promoService.getPaymentMethods()
      .subscribe((rep) => {
        if(rep.code === 200){
          this.paymentMethods = rep.data;
          console.log('this.paymentMethods ===>', this.paymentMethods)
        }
      })
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
    console.log(event.target.value);
    if (event.target.value == "3") {
      this.newPromo.get("amount").clearValidators();
      this.newPromo.get("amount").updateValueAndValidity();
    } else {
      this.newPromo.get("amount").setValidators([Validators.required]);
      this.newPromo.get("amount").updateValueAndValidity();
    }
  }
}
