import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import {
  Validators,
  FormGroup,
  FormArray,
  FormControl,
  FormBuilder,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { PromotionsService } from "@app/pages/services/promotions.service";
import * as moment from "moment";
import { ListsService } from "@app/pages/services/lists.service";
import { Subject, concat, of } from "rxjs";
import { ProductsService } from "@app/pages/services/products.service";
import {
  distinctUntilChanged,
  debounceTime,
  tap,
  switchMap,
  map,
  catchError,
} from "rxjs/operators";
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
  isSubmit: Boolean = false;
  showError: number;
  AllTypesArr = [];
  brands = [];
  lists = [];
  values: FormArray;
  today: Date = new Date();
  stateSubmitting: boolean = false;
  imageUrl: any;
  loading: boolean;
  conditionsProducts: any = [];
  targetsProducts: any = [];
  conditionsTypes: any[] = [
    { id: 1, name: "Different Brands", isDisabled: false },
    { id: 2, name: "Different Products", isDisabled: false },
    { id: 3, name: "Same Proudct", isDisabled: false },
    { id: 4, name: "Any Product", isDisabled: false },
    { id: 5, name: "Different Categories", isDisabled: false },
    { id: 6, name: "Override Discount", isDisabled: false },
    { id: 7, name: "Check All Conditions", isDisabled: false },
  ];

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
      this.addTargetForm();
      this.selectTypeConditions(1);
      this.selectTypeTarget(1);
    } else {
      this.getAllProducts(this.promotionData);
    }
  }

  ngOnChanges(): void {
    this.isSubmit = false;
    this.getForm(this.promotionData);
    if (!this.promotionData) {
      this.addConditionsForm();
      this.addTargetForm();
    } else {
      this.getAllProducts(this.promotionData);
    }
  }

  get conditions(): FormArray {
    return this.promotionForm.get("conditions") as FormArray;
  }
  get targets(): FormArray {
    return this.promotionForm.get("targets") as FormArray;
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
      gift_en: new FormControl(data ? data.gift_en : ""),
      gift_ar: new FormControl(data ? data.gift_ar : ""),
      active: new FormControl(data ? data.active : 1),
      conditionsTypes: new FormControl([]),
      type: new FormControl(data ? data.type : 1, [
        Validators.required,
        Validators.min(0),
      ]),
      showConditions: new FormControl(1),
      showTarget: new FormControl(1),
      times: new FormControl(data ? data.times : null, [Validators.min(0)]),
      conditions: this.formBuilder.array([]),
      targets: this.formBuilder.array([]),
      priority: new FormControl(data ? data.priority : null, [
        Validators.required,
        Validators.min(1),
      ]),
      // different_brands: new FormControl(data ? data.different_brands : 0),
      // different_products: new FormControl(data ? data.different_products : 0),
      // different_categories: new FormControl(
      //   data ? data.different_categories : 0
      // ),
      // override_discount: new FormControl(data ? data.override_discount : 0),
      // check_all_conditions: new FormControl(
      //   data ? data.check_all_conditions : 0
      // ),
      discount_qty: new FormControl(data ? data.discount_qty : "", [
        Validators.required,
        Validators.min(1),
      ]),
      discount: new FormControl(data ? data.discount : "", [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      start_date: new FormControl(
        data && data.start_date ? data.start_date.split(" ")[0] : "",
        Validators.required
      ),
      start_time: new FormControl(
        data && data.start_date ? data.start_date.split(" ")[1] : "00:00:00",
        Validators.required
      ),
      expiration_date: new FormControl(
        data && data.expiration_date ? data.expiration_date.split(" ")[0] : "",
        Validators.required
      ),
      expiration_time: new FormControl(
        data && data.expiration_date
          ? data.expiration_date.split(" ")[1]
          : "00:00:00",
        Validators.required
      ),
    });
    if (data) {
      this.getAllTypes(data);
      data.conditions.forEach((element) => {
        this.addConditionsForm(element);
        this.selectTypeConditions(element.item_type);
      });
      data.targets.forEach((element) => {
        this.addTargetForm(element);
        this.selectTypeTarget(element.item_type);
      });
    }
  }

  getAllTypes(data) {
    this.AllTypesArr = [];
    this.checkTypeIfExist(data.different_brands, 1, 1);
    this.checkTypeIfExist(data.different_products, 1, 2);
    this.checkTypeIfExist(data.different_products, 0, 3);
    this.checkTypeIfExist(data.different_products, 2, 4);
    this.checkTypeIfExist(data.different_categories, 1, 5);
    this.checkTypeIfExist(data.override_discount, 1, 6);
    this.checkTypeIfExist(data.check_all_conditions, 1, 7);

    this.AllTypesArr = this.AllTypesArr.map((item) => item.id);

    this.promotionForm.get("conditionsTypes").setValue(this.AllTypesArr);
    this.promotionForm.get("conditionsTypes").updateValueAndValidity();
    this.changeConditionsTypes();
  }

  checkTypeIfExist(type, value, itemId) {
    if (type == value) {
      const selectedType = this.conditionsTypes.find(
        (item) => item.id === itemId
      );
      this.AllTypesArr.push(selectedType);
    }
  }

  validateAmountOrQty(): ValidatorFn {
    return (group: FormGroup) => {
      const amount = group.controls["amount"];
      const quantity = group.controls["quantity"];
      if (!amount.value && !quantity.value) {
        return { notEquivalent: true };
      }

      return null;
    };
  }

  addConditionsForm(data?, clear = false): void {
    clear && this.conditions.clear();
    this.conditions.push(this.createItem(data));
  }

  createItem(data): FormGroup {
    let fg = this.formBuilder.group({
      item_id: new FormControl(data ? data.item_id : null),
      item_type: new FormControl(data ? data.item_type : 1),
      amount: new FormControl(data ? data.amount : null, [Validators.min(1)]),
      quantity: new FormControl(data ? data.quantity : null, [
        Validators.min(1),
      ]),
      custom_list: new FormControl(
        data ? data.custom_lists.map((res) => res.item_id) : []
      ),
    });
    fg.setValidators(this.validateAmountOrQty());
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

  addTargetForm(data?): void {
    this.targets.push(this.createTargetItem(data));
  }

  createTargetItem(data): FormGroup {
    let fg = this.formBuilder.group({
      item_id: new FormControl(data ? data.item_id : ""),
      item_type: new FormControl(data ? data.item_type : 1),
      custom_list: new FormControl(
        data ? data.custom_lists.map((res) => res.item_id) : []
      ),
    });
    return fg;
  }

  removeTargetForm(index) {
    this.targets.removeAt(index);
  }

  selectTypeTarget(type, index?) {
    let groupItems = this.targets.controls;
    groupItems.forEach((item, i) => {
      if (index == i && !this.promotionData) {
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.item_id.reset();
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.custom_list.reset();
      }
      if (
        this.promotionForm.controls.targets["controls"][i].controls.item_type
          .value == 1
      ) {
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.item_id.setValidators([Validators.required]);
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.custom_list.clearValidators();
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.item_id.updateValueAndValidity();
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.custom_list.updateValueAndValidity();
      } else if (
        this.promotionForm.controls.targets["controls"][i].controls.item_type
          .value == 2
      ) {
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.custom_list.setValidators([Validators.required]);
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.item_id.clearValidators();
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.item_id.updateValueAndValidity();
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.custom_list.updateValueAndValidity();
      } else {
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.custom_list.clearValidators();
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.item_id.clearValidators();
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.item_id.updateValueAndValidity();
        this.promotionForm.controls.targets["controls"][
          i
        ].controls.custom_list.updateValueAndValidity();
      }
    });
    this.promotionForm.get("targets").updateValueAndValidity();
    this.promotionForm.updateValueAndValidity();
  }

  getAllProducts(data) {
    this.conditionsProducts = [];
    this.targetsProducts = [];
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
    data.targets.forEach((item) => {
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
      this.targetsProducts.push({
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
    this.targetsProducts.push({
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
    data.type = Number(data.type);

    this.promotionService.createPromotion(data).subscribe((response: any) => {
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
    data.type = Number(data.type);
    data.expiration_date = moment(data.expiration_date).format("YYYY-MM-DD");

    this.formatData(data);
    this.stateSubmitting = true;
    console.log(data);
    this.promotionService
      .editPromotion(this.promotionData.id, data)
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
    const conditionsTypes = this.promotionForm.get("conditionsTypes").value;
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
    data.different_brands = conditionsTypes.includes(1) ? 1 : 0;
    data.different_categories = conditionsTypes.includes(5) ? 1 : 0;
    data.different_products = conditionsTypes.includes(2)
      ? 1
      : conditionsTypes.includes(3)
      ? 0
      : conditionsTypes.includes(4)
      ? 2
      : null;
    data.override_discount = conditionsTypes.includes(6) ? 1 : 0;
    data.check_all_conditions = conditionsTypes.includes(7) ? 1 : 0;
    delete data.expiration_time;
    delete data.start_time;
    delete data.showConditions;
    delete data.showTarget;
    delete data.conditionsTypes;
    this.handleTypeData(data);
    if (data.conditions) {
      data.conditions.filter((condition) => {
        if (condition.item_type == 1) {
          delete condition.custom_list;
        } else {
          delete condition.item_id;
        }
      });
    }
    if (data.targets) {
      data.targets.filter((condition) => {
        if (condition.item_type == 1) {
          delete condition.custom_list;
        } else {
          delete condition.item_id;
        }
      });
    }
  }

  changeType(e) {
    let type = e.target.value;

    if (type == 2) {
      this.promotionForm.get("gift_en").setValidators([Validators.required]);
      this.promotionForm.get("gift_ar").setValidators([Validators.required]);
      this.promotionForm.addControl("conditions", new FormArray([]));
      this.addConditionsForm(null, true);
      this.selectTypeConditions(1);
    } else if (type == 4) {
      this.promotionForm.removeControl("conditions");
    } else {
      this.promotionForm.get("gift_en").clearValidators();
      this.promotionForm.get("gift_ar").clearValidators();
      this.promotionForm.addControl("conditions", new FormArray([]));
      this.addConditionsForm(null, true);
      this.selectTypeConditions(1);
    }

    this.promotionForm.controls.targets[
      "controls"
    ][0].controls.custom_list.clearValidators();
    this.promotionForm.controls.targets[
      "controls"
    ][0].controls.item_id.clearValidators();
    this.promotionForm.get("gift_en").updateValueAndValidity();
    this.promotionForm.get("gift_ar").updateValueAndValidity();
    this.promotionForm.controls.targets[
      "controls"
    ][0].controls.custom_list.updateValueAndValidity();
    this.promotionForm.controls.targets[
      "controls"
    ][0].controls.item_id.updateValueAndValidity();
    this.promotionForm.get("targets").updateValueAndValidity();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  handleTypeData(data) {
    if (data.type == 1) {
      delete data.gift_en;
      delete data.gift_ar;
    } else if (data.type == 2) {
      delete data.targets;
    }
  }

  changeConditionsTypes(e?) {
    const conditionsTypes = this.promotionForm.get("conditionsTypes").value;
    if (conditionsTypes.includes(2)) {
      this.conditionsTypes
        .filter((item) => item.id === 3 || item.id === 4)
        .map((item) => (item.isDisabled = true));
    } else if (conditionsTypes.includes(3)) {
      this.conditionsTypes
        .filter((item) => item.id === 2 || item.id === 4)
        .map((item) => (item.isDisabled = true));
    } else if (conditionsTypes.includes(4)) {
      this.conditionsTypes
        .filter((item) => item.id === 2 || item.id === 3)
        .map((item) => (item.isDisabled = true));
    } else {
      this.conditionsTypes.map((item) => (item.isDisabled = false));
    }
  }
}
