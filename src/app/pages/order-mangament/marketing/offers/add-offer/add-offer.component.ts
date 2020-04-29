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
    typeCustmerSelect: 1,
    first_order: false,
  };

  newPromo;
  customers: any = [];
  customers$: Observable<any>;
  customersInput$ = new Subject<String>();
  customersLoading: boolean;
  selectFile: File;
  constructor(
    private promoadd: PromosService,
    private toastrService: ToastrService,
    private customerService: CustomerService,
    private router: Router,
    private uploadFile: UploadFilesService
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

    this.promoadd.createPromos(promo).subscribe((response: any) => {
      if (response.code == 200) {
        this.router.navigate(["/pages/promocodes"]);
      } else {
        this.toastrService.error(response.message);
      }
    });
  }
  onImageSelected(form: FormGroup, event) {
    this.selectFile = <File>event.target.files[0];
    this.uploadFile.uploadFile(this.selectFile).subscribe((response: any) => {
      if (response.body) {
        form.get("customer_phones").setValue(response.body.data.filePath);
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
      date: new FormControl("", Validators.required),
      customers: new FormControl(),
      minimum_amount: new FormControl(""),
      customer_phones: new FormControl(""),
      first_order: new FormControl(false),
      typeCustmerSelect: new FormControl(1),
    });
  }
  typeCustmerSelect(event) {
    console.log(event);
  }
}
