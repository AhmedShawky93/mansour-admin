import { UploadFilesService } from "./../../../../services/upload-files.service";
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
import { ListsService } from "@app/pages/services/lists.service";

@Component({
  selector: "app-edit-category",
  templateUrl: "./edit-offer.component.html",
  styleUrls: ["./edit-offer.component.css"],
})
export class EditOfferComponent implements OnInit {
  today: Date;
  editDate: any;
  id;
  promo: any = {
    list_id: '',
  };
  editForm: any;
  promos: any;
  customers: any = [];
  customers$: Observable<any>;
  customersInput$ = new Subject<String>();
  customersLoading: boolean;
  selectFile: File;
  lists: any;
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private promoService: PromosService,
    private _formBuilder: FormBuilder,
    private customerService: CustomerService,
    private toastrService: ToastrService,
    private uploadFile: UploadFilesService,
    private listsService: ListsService
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
      recurrence: ["", Validators.required],
      customers: [],
      customer_phones: new FormControl(""),
      first_order: new FormControl(false),
      list_id: new FormControl(''),
      typeCustmerSelect: new FormControl("1"),
    });

    this.listsService.getLists({})
      .subscribe((response: any) => {
        this.lists = response.data;
      });

    this.today = new Date();
    this.today.setDate(this.today.getDate() - 1);

    this.activeRoute.params.subscribe((params) => {
      let id = params["id"];
      this.promoService.getPromo(id).subscribe((response: any) => {
        this.promo = response.data;
        this.changeTypePromo(this.promo.type)

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
    console.log(this.editForm.value)
    console.log(this.editForm.valid)
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

  changeTypePromo(type) {
    console.log(type);
    if (type == "3") {
      this.editForm.get("editAmount").clearValidators();
      this.editForm.get("editAmount").updateValueAndValidity();
    } else {
      this.editForm.get("editAmount").setValidators([Validators.required]);
      this.editForm.get("editAmount").updateValueAndValidity();
    }
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

  typeCustmerSelect(event) {
    if (this.promo.typeCustmerSelect == "1") {
      this.editForm.get("customer_phones").setValue("");
      this.promo.customer_phones = "";
    } else {
      this.editForm.get("customers").setValue("");
      this.promo.customers = "";
    }
  }
}
