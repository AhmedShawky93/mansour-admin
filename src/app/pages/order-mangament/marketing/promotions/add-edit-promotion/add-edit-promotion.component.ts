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
  ValidatorFn,
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
  isSubmit: Boolean = false;
  showError: number;
  AllTypesArr = [];
  brands = [];
  lists = [];
  incentives = [];
  values: FormArray;
  today: Date = new Date();
  stateSubmitting: boolean = false;
  imageUrl: any;
  loading: boolean;
  conditionsProducts: any = [];
  targetsProducts: any = [];
  groupsList: any = [];
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
    this.getIncentives();
    this.getAllGroups();
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
  getIncentives(){
    this.promotionService.getIncentivs().subscribe((response: any) => {
      this.incentives = response.data;
    });
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
      incentive_id: new FormControl(data ? String(data.incentive_id) : "", Validators.required),
      name: new FormControl(data ? data.name : "", Validators.required),
      name_ar: new FormControl(data ? data.name_ar : "", Validators.required),
      group_id: new FormControl(data ? data.group_id : ""),
      gift_en: new FormControl(data ? data.gift_en : ""),
      gift_ar: new FormControl(data ? data.gift_ar : ""),
      active: new FormControl(data ? data.active : 1),
      boost: new FormControl(data ? data.boost : null),
      exclusive: new FormControl(data ? data.exclusive : false),
      instant: new FormControl(data ? data.instant : true),
      periodic: new FormControl(data ? data.periodic : ""),
      conditionsTypes: new FormControl([]),
      type: new FormControl(1),
      showConditions: new FormControl(1),
      showTarget: new FormControl(1),
      times: new FormControl(data ? data.times : null, [Validators.min(0)]),
      conditions: this.formBuilder.array([]),
      targets: this.formBuilder.array([]),
      priority: new FormControl(data ? data.priority : null, [
        Validators.required,
        Validators.min(1),
      ]),
      discount_qty: new FormControl(data ? data.discount_qty : "", [
        Validators.min(1),
      ]),
      discount: new FormControl(data ? data.discount : "", [
        Validators.min(1),
        Validators.max(100),
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
  getAllGroups() {
    this.promotionService.getGroups().subscribe((res: any) => {
      this.groupsList = res.data;
    });
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
      operator: new FormControl(data ? data.operator : 1),
      amount: new FormControl(data ? data.amount : null, [Validators.min(1)]),
      quantity: new FormControl(data ? data.quantity : null, [
        Validators.min(0.001),
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
      item_id: new FormControl(data ? data.item_id : null),
      item_type: new FormControl(data ? data.item_type : 2),
      operator: new FormControl(data ? data.operator : 1),
      quantity: new FormControl(data ? data.quantity : null, [
        Validators.min(0.001),
      ]),
    });
    this.creatMultiProducts();
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
      var singleProduct = [];
      singleProduct.push(item);
      const products$ = concat(
        of(singleProduct.map((res) => res.product)),
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
    if (this.promotionForm.get("group_id").value == "null") {
      this.promotionForm.get("group_id").setValue(null);
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
    for (let t = 0; t < data.targets.length; t++) {
      if (data.targets[t].item_id == null) {
        data.targets.splice(t, 1);
      }
    }
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
    for (let t = 0; t < data.targets.length; t++) {
      if (data.targets[t].item_id == null) {
        data.targets?.splice(t);
      }
    }
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
