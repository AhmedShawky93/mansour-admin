import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import {
  concat,
  of,
  Subject,
} from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from "rxjs/operators";

import { ListsService } from "@app/pages/services/lists.service";
import { ProductsService } from "@app/pages/services/products.service";
import { PromotionsService } from "@app/pages/services/promotions.service";

@Component({
  selector: "app-add-edit-promotion",
  templateUrl: "./add-edit-promotion.component.html",
  styleUrls: ["./add-edit-promotion.component.css"],
})
export class AddEditPromotionComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataOptionEmit = new EventEmitter();
  @Input("promotionData") promotionData;
  promotionForm: FormGroup;
  ranges: FormArray;
  isSubmit: Boolean = false;
  showError: number;
  brands = [];
  lists = [];
  values: FormArray;
  today: Date = new Date();
  stateSubmitting: boolean = false;
  imageUrl: any;
  loading: boolean;
  conditionsProducts: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private promotionService: PromotionsService,
    private listsService: ListsService,
    private productService: ProductsService
  ) {}

  ngOnInit() {
    this.getLists();
    this.getForm(this.promotionData);
    if (!this.promotionData) {
      this.addConditionsForm();
      this.addRangeForm(null);
      this.selectTypeConditions(1);
    } else {
      this.getAllProducts(this.promotionData);
    }
  }

  ngOnChanges(): void {
    this.isSubmit = false;
    this.getForm(this.promotionData);
    if (!this.promotionData) {
      this.addConditionsForm();
      this.addRangeForm(null);
    } else {
      this.getAllProducts(this.promotionData);
    }
  }

  get conditions(): FormArray {
    return this.promotionForm.get("conditions") as FormArray;
  }

  getLists() {
    this.listsService.getLists({}).subscribe((response: any) => {
      this.lists = response.data;
    });
  }

  getForm(data?) {
    this.promotionForm = this.formBuilder.group({
      name: new FormControl(data ? data.name : "", Validators.required),
      name_ar: new FormControl(data ? data.name_ar : "", Validators.required),
      active: new FormControl(data ? data.active : 1),
      showConditions: new FormControl(1),
      showTarget: new FormControl(1),
      conditions: this.formBuilder.array([]),
      segments: new FormArray([]),
      priority: new FormControl(data ? data.priority : null, [
        Validators.required,
        Validators.min(1),
      ]),
      start_date: new FormControl(
        data && data.start_date ? data.start_date.split(" ")[0] : "",
        Validators.required
      ),
      start_time: new FormControl(
        data && data.start_date && data.start_date.split(" ")[1]
          ? `${data.start_date.split(" ")[1].substring(0, 5)}`
          : "00:00",
        Validators.required
      ),
      expiration_date: new FormControl(
        data && data.expiration_date ? data.expiration_date.split(" ")[0] : "",
        Validators.required
      ),
      expiration_time: new FormControl(
        data && data.expiration_date && data.expiration_date.split(" ")[1]
          ? `${data.expiration_date.split(" ")[1].substring(0, 5)}`
          : "00:00",
        Validators.required
      ),
    });

    if (data) {
      data.conditions.forEach((element) => {
        this.addConditionsForm(element);
        this.selectTypeConditions(element.item_type);
      });
      data.segments.forEach((element) => {
        this.addRangeForm(element);
      });
    }
  }

  addConditionsForm(data?, clear = false): void {
    clear && this.conditions.clear();
    this.conditions.push(this.createItem(data));
  }

  createItem(data): FormGroup {
    let fg = this.formBuilder.group({
      item_id: new FormControl(data ? data.item_id : null),
      item_type: new FormControl(data ? data.item_type : 1),
      custom_list: new FormControl(
        data ? data.custom_lists.map((res) => res.item_id) : []
      ),
    });
    this.creatMultiProducts();
    return fg;
  }

  removeConditionsForm(index) {
    this.conditions.removeAt(index);
  }

  selectTypeConditions(type, index?) {
    let groupItems = this.conditions.controls;
    groupItems.forEach((item, i) => {
      if (index == i && !this.promotionData) {
        this.promotionForm.controls.conditions["controls"][
          i
        ].controls.item_id.reset();
        this.promotionForm.controls.conditions["controls"][
          i
        ].controls.custom_list.reset();
      }
      if (
        this.promotionForm.controls.conditions["controls"][i].controls.item_type
          .value == 1
      ) {
        this.promotionForm.controls.conditions["controls"][
          i
        ].controls.item_id.setValidators([Validators.required]);
        this.promotionForm.controls.conditions["controls"][
          i
        ].controls.custom_list.clearValidators();
        this.promotionForm.controls.conditions["controls"][
          i
        ].controls.item_id.updateValueAndValidity();
        this.promotionForm.controls.conditions["controls"][
          i
        ].controls.custom_list.updateValueAndValidity();
      } else if (
        this.promotionForm.controls.conditions["controls"][i].controls.item_type
          .value == 2
      ) {
        this.promotionForm.controls.conditions["controls"][
          i
        ].controls.custom_list.setValidators([Validators.required]);
        this.promotionForm.controls.conditions["controls"][
          i
        ].controls.item_id.clearValidators();
        this.promotionForm.controls.conditions["controls"][
          i
        ].controls.item_id.updateValueAndValidity();
        this.promotionForm.controls.conditions["controls"][
          i
        ].controls.custom_list.updateValueAndValidity();
      }
    });
    this.promotionForm.get("conditions").updateValueAndValidity();
    this.promotionForm.updateValueAndValidity();
  }

  addRangeForm(data): void {
    this.ranges = this.promotionForm.get("segments") as FormArray;
    this.ranges.push(this.createRangeItem(data));
  }
  createRangeItem(data): FormGroup {
    return this.formBuilder.group({
      discount: new FormControl(data ? data.discount : "", [
        Validators.required,
      ]),
      min: new FormControl(data ? data.min : "", [Validators.required]),
      max: new FormControl(data ? data.max : null),
      iterator: new FormControl(data ? data.iterator : "", [
        Validators.required,
      ]),
      override_range: new FormControl(data ? data.override_range : 0),
      discount_type: new FormControl(data ? data.discount_type : 1, [
        Validators.required,
      ]),
    });
  }
  changeOveride(index) {
    this.promotionForm.controls.segments["controls"][
      index
    ].controls.override_range.setValue(
      this.promotionForm.controls.segments["controls"][index].controls
        .override_range
        ? 1
        : 0
    );
  }
  removeRangeForm(index) {
    this.ranges.removeAt(index);
  }
  getAllProducts(data) {
    this.conditionsProducts = [];
    data.conditions.forEach((item) => {
      const productsInput$ = new Subject<String>();
      let productsLoading = false;
      const products$ = concat(
        of(item.custom_lists.map((res) => res.product)),
        productsInput$.pipe(
          debounceTime(200),
          distinctUntilChanged(),
          tap(() => (productsLoading = true)),
          switchMap((term) =>
            this.productService.searchProducts({ q: term, variant: 1 }, 1).pipe(
              catchError(() => of([])),
              tap(() => (productsLoading = false)),
              map((response: any) => {
                return response.data.products.map((p) => {
                  return {
                    id: p.id,
                    name: p.name,
                  };
                });
              })
            )
          )
        )
      );
      this.conditionsProducts.push({
        products$: products$,
        productsInput$: productsInput$,
        productsLoading: productsLoading,
      });
    });
    // data.targets.forEach((item) => {
    //   const productsInput$ = new Subject<String>();
    //   let productsLoading = false;
    //   const products$ = concat(
    //     of(item.custom_lists.map((res) => res.product)),
    //     productsInput$.pipe(
    //       debounceTime(200),
    //       distinctUntilChanged(),
    //       tap(() => (productsLoading = true)),
    //       switchMap((term) =>
    //         this.productService.searchProducts({ q: term, variant: 1 }, 1).pipe(
    //           catchError(() => of([])),
    //           tap(() => (productsLoading = false)),
    //           map((response: any) => {
    //             return response.data.products.map((p) => {
    //               return {
    //                 id: p.id,
    //                 name: p.name,
    //               };
    //             });
    //           })
    //         )
    //       )
    //     )
    //   );
    // });
  }

  creatMultiProducts() {
    let productsInput$ = new Subject<String>();
    let productsLoading = false;
    let products$ = concat(
      of([]),
      productsInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (productsLoading = true)),
        switchMap((term) =>
          this.productService.searchProducts({ q: term, variant: 1 }, 1).pipe(
            catchError(() => of([])),
            tap(() => (productsLoading = false)),
            map((response: any) => {
              return response.data.products.map((p) => {
                return {
                  id: p.id,
                  name: p.name,
                };
              });
            })
          )
        )
      )
    );
    this.conditionsProducts.push({
      products$: products$,
      productsInput$: productsInput$,
      productsLoading: productsLoading,
    });
  }

  closeSideBar() {
    this.closeSideBarEmit.emit();
    this.promotionForm.reset();
  }

  submitForm() {
    this.isSubmit = true;
    if (!this.promotionForm.valid) {
      this.markFormGroupTouched(this.promotionForm);
      return;
    }
    if (this.promotionData) {
      this.editPromotion();
    } else {
      this.createPromotion();
    }
  }

  createPromotion() {
    const data = this.promotionForm.value;
    data.expiration_date = moment(data.expiration_date).format("YYYY-MM-DD");
    this.formatData(data);
    data.active = 1;
    this.stateSubmitting = true;
    // data.type = Number(data.type);

    this.promotionService
      .createRangePromotion(data)
      .subscribe((response: any) => {
        if (response.code == 200) {
          this.promotionForm.reset();
          this.dataOptionEmit.emit(response.data);
          this.imageUrl = "";
          this.promotionForm.reset();
          this.stateSubmitting = false;
          this.isSubmit = false;
          this.closeSideBar();
        } else {
          this.toastrService.error(response.message);
        }
        this.stateSubmitting = false;
      });
  }

  editPromotion() {
    const data = this.promotionForm.value;
    // data.type = Number(data.type);
    data.expiration_date = moment(data.expiration_date).format("YYYY-MM-DD");

    this.formatData(data);
    this.stateSubmitting = true;
    console.log(data);
    this.promotionService
      .editRangePromotion(this.promotionData.id, data)
      .subscribe((response: any) => {
        if (response.code == 200) {
          this.dataOptionEmit.emit(response.data);
          this.imageUrl = "";
          this.promotionForm.reset();
          this.stateSubmitting = false;
          this.isSubmit = false;
          this.closeSideBar();
        } else {
          this.toastrService.error(response.message);
        }
        this.stateSubmitting = false;
      });
  }

  formatData(data) {
    data.expiration_date = moment(
      this.promotionForm.get("expiration_date").value
    ).format("YYYY-MM-DD");
    data.expiration_date =
      data.expiration_date +
      " " +
      this.promotionForm.get("expiration_time").value;
    data.expiration_date = moment(data.expiration_date).format(
      "YYYY-MM-DD HH:mm"
    );
    data.start_date = moment(this.promotionForm.get("start_date").value).format(
      "YYYY-MM-DD"
    );
    data.start_date =
      data.start_date + " " + this.promotionForm.get("start_time").value;
    data.start_date = moment(data.start_date).format("YYYY-MM-DD HH:mm");
    // data.different_brands = conditionsTypes.includes(1) ? 1 : 0;
    // data.different_categories = conditionsTypes.includes(5) ? 1 : 0;
    // data.different_products = conditionsTypes.includes(2)
    //   ? 1
    //   : conditionsTypes.includes(3)
    //   ? 0
    //   : conditionsTypes.includes(4)
    //   ? 2
    //   : null;
    // data.override_discount = conditionsTypes.includes(6) ? 1 : 0;
    // data.check_all_conditions = conditionsTypes.includes(7) ? 1 : 0;
    delete data.expiration_time;
    delete data.start_time;
    delete data.showConditions;
    delete data.showTarget;
    if (data.conditions) {
      data.conditions.filter((condition) => {
        if (condition.item_type == 1) {
          delete condition.custom_list;
        } else {
          delete condition.item_id;
        }
      });
    }
    // if (data.targets) {
    //   data.targets.filter((condition) => {
    //     if (condition.item_type == 1) {
    //       delete condition.custom_list;
    //     } else {
    //       delete condition.item_id;
    //     }
    //   });
    // }
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
