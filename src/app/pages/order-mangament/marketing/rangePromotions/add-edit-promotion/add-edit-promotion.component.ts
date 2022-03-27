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
import { concat, of, Subject } from "rxjs";
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
  incentives = [];
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
    this.getIncentives();
    this.getForm(this.promotionData);
    if (!this.promotionData) {
      this.addConditionsForm();
      this.addRangeForm(null);
      this.selectTypeConditions(1);
    } else {
      this.getAllProducts(this.promotionData);
    }
  }
  getIncentives() {
    this.promotionService.getIncentivs().subscribe((response: any) => {
      this.incentives = response.data;
    });
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
      incentive_id: new FormControl(
        data ? String(data.incentive_id) : "",
        Validators.required
      ),
      name: new FormControl(
        data ? this.findInIncentive(data.incentive_id, "incentive_desc") : "",
        Validators.required
      ),
      name_ar: new FormControl(
        data
          ? this.findInIncentive(data.incentive_id, "arabic_description")
          : "",
        Validators.required
      ),
      description: new FormControl(data ? data.description : ""),
      description_ar: new FormControl(data ? data.description_ar : ""),
      active: new FormControl(data ? data.active : 1),
      showConditions: new FormControl(1),
      showTarget: new FormControl(1),
      conditions: this.formBuilder.array([]),
      segments: new FormArray([]),
      priority: new FormControl(data ? data.priority : null, [
        Validators.required,
        Validators.min(1),
      ]),
      exclusive: new FormControl(data ? data.exclusive : false),
      instant: new FormControl(data ? data.instant : true),
      periodic: new FormControl(data ? data.periodic : ""),
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

  findInIncentive(id, value) {
    let incentive = this.incentives.find(
      (incentive) => incentive.incentive_id == id
    );
    return incentive[value];
  }

  setValues() {
    this.promotionForm
      .get("name")
      .setValue(
        this.findInIncentive(
          this.promotionForm.get("incentive_id").value,
          "incentive_desc"
        )
      );
    this.promotionForm.get("name").updateValueAndValidity();

    this.promotionForm
      .get("name_ar")
      .setValue(
        this.findInIncentive(
          this.promotionForm.get("incentive_id").value,
          "arabic_description"
        )
      );
    this.promotionForm.get("name_ar").updateValueAndValidity();
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
      min: new FormControl(data ? data.min : "", [
        Validators.required,
        Validators.min(0.001),
      ]),
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
        .override_range.value
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
    if (
      this.promotionForm.get("exclusive").value == true ||
      this.promotionForm.get("exclusive").value == 1
    ) {
      this.promotionForm.get("exclusive").setValue(1);
      this.promotionForm.get("exclusive").updateValueAndValidity();
    } else {
      this.promotionForm.get("exclusive").setValue(0);
      this.promotionForm.get("exclusive").updateValueAndValidity();
    }
    if (
      this.promotionForm.get("instant").value == true ||
      this.promotionForm.get("instant").value == 1
    ) {
      this.promotionForm.get("instant").setValue(1);
      this.promotionForm.get("instant").updateValueAndValidity();
    } else {
      this.promotionForm.get("instant").setValue(0);
      this.promotionForm.get("instant").updateValueAndValidity();
    }

    if (
      this.promotionForm.get("periodic").value == "" ||
      this.promotionForm.get("periodic").value == 0
    ) {
      this.promotionForm.get("periodic").setValue(null);
      this.promotionForm.get("periodic").updateValueAndValidity();
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
    data.expiration_date = moment(data.expiration_date).format("YYYY-MM-DD");

    this.formatData(data);
    this.stateSubmitting = true;
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
