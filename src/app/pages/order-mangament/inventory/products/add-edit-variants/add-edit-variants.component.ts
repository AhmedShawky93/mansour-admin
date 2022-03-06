import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { uniqBy } from "lodash";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { combineLatest, concat, Observable, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from "rxjs/operators";

import { CategoryService } from "@app/pages/services/category.service";
import { OptionsService } from "@app/pages/services/options.service";
import { ProductsService } from "@app/pages/services/products.service";
import { PromosService } from "@app/pages/services/promos.service";
import { UploadFilesService } from "@app/pages/services/upload-files.service";
import {
  compareNumbers,
  DateLessThan,
} from "@app/shared/date-range-validation";
import { environment } from "environments/environment.prod";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { ReactivityService } from "@app/shared/services/reactivity.service";

@Component({
  selector: "app-add-edit-variants",
  templateUrl: "./add-edit-variants.component.html",
  styleUrls: ["./add-edit-variants.component.css"],
})
export class AddEditVariantsComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataProductEmit = new EventEmitter();
  @Input() selectVariant;
  @Input() parentProduct;

  submitting: boolean;
  variantForm: FormGroup;
  options: FormArray;
  addSubImages: FormArray;
  price: any;
  editorConfig: AngularEditorConfig;
  regex = "\\d*(\\.\\d{1,2})?$";
  products: any = [];
  products$: Observable<any>;
  productsInput$ = new Subject<String>();
  allOptions$: Observable<Object>;
  categories$: Observable<Object>;
  mainProduct$: Observable<Object>;
  allOptions: Array<any> = [];
  categories = [];
  productsLoading: boolean;
  attribute_options = [];
  option_values: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private uploadFile: UploadFilesService,
    private productsService: ProductsService,
    private _CategoriesService: CategoryService,
    private toasterService: ToastrService,
    private spinner: NgxSpinnerService,
    private optionsService: OptionsService,
    private promoService: PromosService,
    private reactivityService: ReactivityService
  ) {
    this.allOptions$ = this.optionsService.getOptions();
    this.categories$ = this._CategoriesService.getCategories();
    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: "175px",
      minHeight: "5rem",
      maxHeight: "auto",
      width: "100%",
      translate: "yes",
      enableToolbar: true,
      showToolbar: true,
      placeholder: "Enter text here...",
      defaultParagraphSeparator: "",
      defaultFontName: "",
      defaultFontSize: "",
      sanitize: false,
      toolbarPosition: "top"
    };
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.setForm(this.selectVariant);
    this.getInitialData();
  }

  getInitialData() {
    this.spinner.show();
    this.mainProduct$ = this.productsService.getProductById(
      this.parentProduct.id
    );
    let sources;
    if (!this.parentProduct.category) {
      sources = [this.allOptions$, this.categories$, this.mainProduct$];
    } else {
      sources = [this.allOptions$, this.categories$];
    }
    combineLatest([...sources]).subscribe(
      ([options, categories, mainProduct]) => {
        this.parentProduct = mainProduct
          ? mainProduct["data"]
          : this.parentProduct;
        this.getAllOptions(options);
        this.getCategories(categories);
        this.mergeData(this.selectVariant);
        this.setData(this.selectVariant);
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  closeSideBar() {
    this.variantForm.reset();
    this.closeSideBarEmit.emit();
  }

  setForm(data) {
    this.variantForm = this.formBuilder.group(
      {
        image: new FormControl(data ? data.image : "", Validators.required),
        images: this.formBuilder.array([]),
        name: new FormControl(data ? data.name : "", Validators.required),
        name_ar: new FormControl(data ? data.name_ar : "", Validators.required),
        product_with_variant: new FormControl(false),
        description: new FormControl(data ? data.description : "", [
          Validators.required,
        ]),
        description_ar: new FormControl(data ? data.description_ar : "", [
          Validators.required,
        ]),
        long_description_en: new FormControl(
          data ? data.long_description_en : ""
        ),
        long_description_ar: new FormControl(
          data ? data.long_description_ar : ""
        ),
        meta_title: new FormControl(data ? data.meta_title : ""),
        weight: new FormControl(1),
        meta_description: new FormControl(data ? data.meta_description : ""),
        order: new FormControl(data ? data.order : ""),
        meta_title_ar: new FormControl(data ? data.meta_title_ar : ""),
        meta_description_ar: new FormControl(
          data ? data.meta_description_ar : ""
        ),
        price: new FormControl(data ? data.price : "", [
          Validators.required,
          Validators.min(1),
          Validators.max(1000000),
        ]),
        default_variant: new FormControl(data ? data.default_variant : 0),
        bundle_products_ids: new FormControl(
          data && data.bundleProducts
            ? data.bundleProducts.map((bp) => bp.id)
            : []
        ),
        stock: new FormControl(data ? data.stock : 0, Validators.required),
        preorder: new FormControl(data ? data.preorder : 0),
        sku: new FormControl(data ? data.sku : "", Validators.required),
        options: this.formBuilder.array([]),
        option_values: this.formBuilder.array([]),
      }
    );
  }


  getCategories(res: any) {
    if (res.code === 200) {
      this.categories = res.data;
      this.categories = this.categories.map((c) => {
        c.selected = false;
        return c;
      });
    }
  }

  getAllOptions(res: any) {
    if (res["code"] === 200) {
      this.allOptions = res["data"];
    } else {
      this.toasterService.error(res["message"]);
    }
  }

  mergeData(data) {
    let bundleProducts = [];
    if (data && data.bundleProducts) {
      bundleProducts = data.bundleProducts.map((bp) => {
        return {
          id: bp.id,
          name: bp.sku + ": " + bp.name,
        };
      });
    }
    this.products$ = concat(
      of(bundleProducts),
      this.productsInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.productsLoading = true)),
        switchMap((term) =>
          this.productsService.searchProducts({ q: term, variant: 1 }, 1).pipe(
            catchError(() => of([])),
            tap(() => (this.productsLoading = false)),
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
  }

  setData(data) {
    this.reMapOptions(data);
    this.addVariantOptionsToForm();
    this.changeValidation();
    if (data) data.images.forEach((img) => this.addImage(img));
  }

  reMapOptions(data) {
    if (data && data.options.length) {
      data.options.forEach((element) => {
        element.option["values"] = this.allOptions.find(
          (op) => op.id === element.option.id
        )["values"];
        this.attribute_options.push(element.option);
        this.addOptionsEdit(element);
      });
    } else {
      this.selectSubCategoryOption(
        this.parentProduct.category.id,
        this.parentProduct.category_id
      );
      if (
        this.parentProduct.optional_category &&
        this.parentProduct.optional_category.length
      ) {
        this.selectSubCategoryOption(
          this.parentProduct.optional_category.id,
          this.parentProduct.optional_sub_category_id,
          true
        );
      }
    }
  }

  formValidator() {
    if (!this.variantForm.valid) {
      this.markFormGroupTouched(this.variantForm);
      this.reactivityService.scrollToFirstError("add-edit-product-form");
      return false;
    } else {
      return true;
    }
  }

  formControlValidator(controlName, err) {
    if (
      this.variantForm.controls[controlName].touched &&
      this.variantForm.controls[controlName].dirty
    ) {
      if (this.variantForm.controls[controlName].errors) {
        return this.variantForm.controls[controlName].errors[err];
      }
    }
  }

  formGroupControlsValidator(formGroup, controlName, err) {
    if (
      formGroup.controls[controlName].touched &&
      formGroup.controls[controlName].dirty
    ) {
      if (formGroup.controls[controlName].errors) {
        return formGroup.controls[controlName].errors[err];
      }
    }
  }

  changeValidation() {
    if (this.parentProduct && this.parentProduct.available_soon) {
      this.variantForm.get("price").clearValidators();
      this.variantForm.get("price").updateValueAndValidity();
    }
  }

  createVariantOption(item): FormGroup {
    if (item.type === "4") {
      return this.formBuilder.group({
        optionData: item,
        option_id: new FormControl(item.id, [Validators.required]),
        option_value_id: new FormControl(
          item.selectedValue ? item.selectedValue.id : "",
          [Validators.required]
        ),
        option_image: new FormControl(
          item.selectedValue ? item.selectedValue.image : "",
          [Validators.required]
        ),
      });
    } else if (item.type === "5") {
      return this.formBuilder.group({
        optionData: item,
        option_id: new FormControl(item.id, [Validators.required]),
        option_value_id: new FormControl(
          item.selectedValue ? item.selectedValue.id : ""
        ),
        input_ar: new FormControl(
          item.selectedValue ? item.selectedValue.input_ar : "",
          [Validators.required]
        ),
        input_en: new FormControl(
          item.selectedValue ? item.selectedValue.input_en : "",
          [Validators.required]
        ),
      });
    } else {
      return this.formBuilder.group({
        optionData: item,
        option_id: new FormControl(item.id, Validators.required),
        option_value_id: new FormControl(
          item.selectedValue ? item.selectedValue.id : "",
          [Validators.required]
        ),
      });
    }
  }

  addVariantOptionsToForm() {
    if (this.parentProduct && !this.selectVariant) {
      /*Case Create New*/
      this.parentProduct.product_variant_options.forEach((item) => {
        this.options = this.variantForm.get("options") as FormArray;
        this.options.push(this.createVariantOption(item));
      });
    } else if (this.parentProduct && this.selectVariant) {
      /*Case Update*/
      const selectedOptions = this.selectVariant.product_variant_options.map(
        (data) => {
          return { option: data, selectedValue: data.values[0] };
        }
      );

      this.parentProduct.product_variant_options.forEach((item) => {
        const selected = selectedOptions.find(
          (op) => Number(op.option.id) === Number(item.id)
        );
        if (selected) {
          item["selectedValue"] = selected.selectedValue;
        }
        this.options = this.variantForm.get("options") as FormArray;
        this.options.push(this.createVariantOption(item));
      });
    }
  }

  selectSubCategoryOption(
    category_id,
    subcategory_id,
    loopDone: boolean = null
  ) {
    if (category_id && subcategory_id) {
      const index = this.categories.findIndex(
        (item) => item.id === Number(category_id)
      );
      if (index !== -1) {
        const ind = this.categories[index].sub_categories.findIndex(
          (c) => c.id === Number(subcategory_id)
        );
        if (ind !== -1) {
          const data = this.categories[index].sub_categories[ind].options;
          this.attribute_options.push(...data);
        }
      }
    }
    if (loopDone) {
      this.attribute_options = uniqBy(this.attribute_options, "id");
      this.attribute_options.forEach((element) => {
        this.addOptions(element);
      });
    }
  }

  addOptions(data): void {
    this.option_values = this.variantForm.get("option_values") as FormArray;
    this.option_values.push(this.createItemOptions(data));
  }

  createItemOptions(data): FormGroup {
    return this.formBuilder.group({
      type: new FormControl(data ? data.type : ""),
      option_id: new FormControl(data ? data.id : ""),
      name_en: new FormControl(data ? data.name_en : ""),
      optionValues: new FormControl(data ? data.values : ""),
      option_value_id: new FormControl(""),
      input_en: new FormControl(""),
      input_ar: new FormControl(""),
    });
  }

  addOptionsEdit(data): void {
    this.option_values = this.variantForm.get("option_values") as FormArray;
    this.option_values.push(this.createItemOptionsEdit(data));
  }

  createItemOptionsEdit(data): FormGroup {
    return this.formBuilder.group({
      type: new FormControl(data ? data.option.type : ""),
      option_id: new FormControl(data ? data.option.id : ""),
      name_en: new FormControl(data ? data.option.name_en : ""),
      optionValues: new FormControl(data ? data.option.values : ""),
      option_value_id: new FormControl(data ? data.value.id : ""),
      input_en: new FormControl(
        data && data.value.input_en ? data.value.input_en : ""
      ),
      input_ar: new FormControl(
        data && data.value.input_ar ? data.value.input_ar : ""
      ),
    });
  }

  addImage(data: any = null) {
    this.addSubImages = this.variantForm.get("images") as FormArray;
    this.addSubImages.push(this.createImageFormControl(data));
  }

  createImageFormControl(data): FormGroup {
    return this.formBuilder.group({
      url: new FormControl(data ? data.url : ""),
    });
  }

  createProduct(product) {
    this.submitting = true;
    this.productsService
      .creatProductVariant(this.parentProduct.id, product)
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.toasterService.success("Product Variant Added Successfully");
          this.dataProductEmit.emit(response.data);
          this.closeSideBar();
        } else {
          this.toasterService.error(response.message);
        }
        this.submitting = false;
      });
  }

  updateProduct(product) {
    this.submitting = true;
    this.productsService
      .updateProductVariant(
        this.parentProduct.id,
        this.selectVariant.id,
        product
      )
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.toasterService.success("Product Variant Updated Successfully");
          this.dataProductEmit.emit(response.data);
          this.closeSideBar();
        } else {
          this.toasterService.error(response.message);
        }
        this.submitting = false;
      });
  }

  mappingDataForSaving() {
    const data = this.variantForm.value;
    data.options.forEach((item) => {
      delete item.optionData;
    });
    return data;
  }


  save() {
    if (this.formValidator()) {
      if (!this.selectVariant) {
        this.createProduct(this.mappingDataForSaving());
      } else {
        this.updateProduct(this.mappingDataForSaving());
      }
    }
  }

  removeImage(index) {
    this.addSubImages = this.variantForm.get("images") as FormArray;
    this.addSubImages.removeAt(index);
    this.variantForm.updateValueAndValidity();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object)
      .values(formGroup.controls)
      .forEach((control: FormGroup, ind) => {
        control.markAsTouched();
        control.markAsDirty();
        if (control.controls) {
          this.markFormGroupTouched(control);
        }
      });
  }
}
