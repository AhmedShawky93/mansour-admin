import { ProductsService } from "@app/pages/services/products.service";
import { CategoryService } from "@app/pages/services/category.service";
import { UploadFilesService } from "@app/pages/services/upload-files.service";
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
import { ToastrService } from "ngx-toastr";
import { DateLessThan } from "@app/shared/date-range-validation";
import * as moment from "moment";
import { OptionsService } from "@app/pages/services/options.service";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { Observable, Subject, concat, of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
  map,
} from "rxjs/operators";
import { environment } from "environments/environment.prod";
import { ReactivityService } from "@app/shared/services/reactivity.service";

@Component({
  selector: "app-add-edit-product",
  templateUrl: "./add-edit-product.component.html",
  styleUrls: ["./add-edit-product.component.css"],
})
export class AddEditProductComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataProductEmit = new EventEmitter();
  @Input("selectProductDataEdit") selectProductDataEdit;
  @Input("categoriesarray") categoriesarray;
  addProductForm: FormGroup;
  addSubImages: FormArray;
  deleted_images: any;
  imageUrl: any;
  showError: number;
  selectImages: File;
  categories: any;
  sub_categories: any;
  category_id: "";
  optionalCategories: any;
  optionalSubCategories: any;
  optionalCategoryId: any;
  brands: any;
  submitting: boolean;
  loading: boolean;
  options = [];
  option_values: FormArray;
  price: number;
  allOptions: Array<any> = [];
  editorConfig: AngularEditorConfig;

  relatedProducts: any = [];
  relatedProducts$: Observable<any>;
  relatedProductsInput$ = new Subject<String>();
  relatedProductsLoading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private uploadFile: UploadFilesService,
    private productsService: ProductsService,
    private _CategoriesService: CategoryService,
    private optionsService: OptionsService,
    private toastrService: ToastrService,
    private reactivityService: ReactivityService
  ) {
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
      sanitize: false,
      defaultFontSize: "",
      toolbarPosition: "top",
      customClasses: [
        {
          name: "imgEditor",
          class: "imgEditor",
          tag: "img",
        },
      ],
    };
  }

  ngOnInit() {
    this.getAllOptions();
    this.getForm(this.selectProductDataEdit);
  }

  ngOnChanges() {
    this.getCategories(this.categoriesarray);

    this.getForm(this.selectProductDataEdit);
    this.setData(this.selectProductDataEdit);
  }

  getForm(data) {
    this.addProductForm = this.formBuilder.group({
      name: new FormControl(data ? data.name : "", Validators.required),
      name_ar: new FormControl(data ? data.name_ar : "", Validators.required),
      discount_price: new FormControl(data ? data.discount_price : "", [
        Validators.min(1),
        (control: AbstractControl) => Validators.max(this.price)(control),
      ]),
      brand_id: new FormControl(data ? data.brand_id : ""),
      main_category: new FormControl(
        data && data.category ? data.category.id : ""
      ),
      category_id: new FormControl(
        data ? data.category_id : "",
        Validators.required
      ),
      optional_category: new FormControl(
        data && data.optional_category ? data.optional_category.id : ""
      ),
      optional_sub_category_id: new FormControl(
        data && data.optional_sub_category_id
          ? data.optional_sub_category_id
          : ""
      ),
      sku: new FormControl(data ? data.sku : "", Validators.required),
      max_per_order: new FormControl(data ? data.max_per_order : ""),
      min_days: new FormControl(data ? data.min_days : ""),
      stock_alert: new FormControl(data ? data.stock_alert : ""),
      type: new FormControl(data ? data.type : 1, Validators.required),
      has_stock: new FormControl(data ? data.has_stock : ""),
      bundle_checkout: new FormControl(data ? data.bundle_checkout : ""),
      related_ids: new FormControl(
        data ? data.relatedProducts.map((rp) => rp.id) : ""
      ),
      option_values: this.formBuilder.array([]),
      product_variant_options: new FormControl(
        data ? data.product_variant_options.map((item) => item.id) : "",
        []
      ),
    });
  }

  getAllOptions() {
    this.optionsService.getOptions({}).subscribe((res) => {
      if (res["code"] === 200) {
        this.allOptions = res["data"].filter((data) => Number(data.type) !== 5);
      } else {
        this.toastrService.error(res["message"]);
      }
    });
  }
  setData(data) {
    if (data) {
      this.setCategoriesData(data);
      if (data.options.length) {
        data.options.forEach((element) => {
          element.option["values"] = this.allOptions.find(
            (op) => op.id === element.option.id
          )["values"];
          this.options.push(element.option);
          this.addOptionsEdit(element);
        });
      }
    }

    let relatedProducts = [];
    if (data && data.relatedProducts) {
      relatedProducts = data.relatedProducts.map((bp) => {
        return {
          id: bp.id,
          name: bp.sku + ": " + bp.name,
        };
      });
    }
    this.relatedProducts$ = concat(
      of(relatedProducts),
      this.relatedProductsInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.relatedProductsLoading = true)),
        switchMap((term) =>
          this.productsService.searchProducts({ q: term, variant: 1 }, 1).pipe(
            catchError(() => of([])),
            tap(() => (this.relatedProductsLoading = false)),
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
  setCategoriesData(data) {
    this.imageUrl = data.image;
    const cat_id = data.category.id;
    const index = this.categories.findIndex((item) => item.id === cat_id);
    this.categories[index].selected = true;
    const category = this.categories[index];
    this.sub_categories = category.sub_categories;

    const op_cat_id = data.optional_category ? data.optional_category.id : null;
    const op_cat_index = this.optionalCategories.findIndex(
      (item) => item.id === op_cat_id
    );
    if (op_cat_index !== -1) {
      this.optionalCategories[index].selected = true;
      const optionalCategory = this.optionalCategories[op_cat_index];
      this.optionalSubCategories = optionalCategory.sub_categories;
    }
  }

  closeSideBar() {
    this.closeSideBarEmit.emit();
    this.addProductForm.reset();
  }

  addImage(): void {
    if (this.addProductForm.get("images").value.length < 4) {
      this.addSubImages = this.addProductForm.get("images") as FormArray;
      this.addSubImages.push(this.createItem());
    }
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      url: "",
      urlPath: "",
    });
  }
  addOptions(data): void {
    this.option_values = this.addProductForm.get("option_values") as FormArray;
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
    this.option_values = this.addProductForm.get("option_values") as FormArray;
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

  removeImage(product, index) {
    const images = this.addProductForm.get("images").value;
    if (product.id) {
      this.deleted_images.push(product.images[index].id);
    }
    this.addSubImages.removeAt(index);
  }

  onimgeSelected(form: FormGroup, event) {
    if (event.target.value) {
      this.loading = true;
      const selectFile = <File>event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.imageUrl = reader.result;
      };
      this.uploadFile.uploadFile(selectFile).subscribe((response: any) => {
        if (response.body) {
          this.imageUrl = response.body.data.filePath;
          form.get("image").setValue(response.body.data.filePath);

          this.showError = 0;
        }
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
    }
  }

  onimagesSelected(event, index) {
    const images = this.addProductForm.get("images").value[index];
    this.selectImages = <File>event.target.files[0];
    this.uploadFile.uploadFile(this.selectImages).subscribe((response: any) => {
      if (response.body) {
        images.url = response.body.data.name;
        images.urlPath = response.body.data.filePath;
        this.showError = 0;
      }
    });
  }

  addProducts() {
    if (this.selectProductDataEdit) {
      const product = this.addProductForm.value;
      if (!this.addProductForm.valid) {
        this.markFormGroupTouched(this.addProductForm);
        this.reactivityService.scrollToFirstError("add-edit-product-form");
        return;
      }
      product.option_values.forEach((item) => {
        delete item.optionValues;
        delete item.name_en;
      });

      this.submitting = true;
      this.productsService
        .updateProduct(this.selectProductDataEdit.id, product)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.toastrService.success("Product Updated Successfully");
            this.addProductForm.reset();
            this.dataProductEmit.emit(response.data);
            this.closeSideBar();
          } else {
            this.toastrService.error(response.message);
          }
          this.submitting = false;
        });
    } else {
      const product = this.addProductForm.value;
      product.image = this.imageUrl;
      delete product.main_category;
      if (this.addProductForm.invalid) {
        this.markFormGroupTouched(this.addProductForm);
        return;
      }
      product.option_values.forEach((item) => {
        delete item.optionValues;
        delete item.name_en;
      });
      this.submitting = true;
      this.productsService.creatProduct(product).subscribe((response: any) => {
        if (response.code == 200) {
          this.toastrService.success("Product Added Successfully");
          this.addProductForm.reset();
          this.dataProductEmit.emit(response.data);
          this.closeSideBar();
        } else {
          this.toastrService.error(response.message);
        }
        this.submitting = false;
      });
    }
  }

  formControlValidator(currentForm, controlName, err) {
    if (
      currentForm.controls[controlName].touched &&
      currentForm.controls[controlName].dirty
    ) {
      if (currentForm.controls[controlName].errors) {
        return currentForm.controls[controlName].errors[err];
      }
    }
  }

  getCategories(data) {
    if (data) {
      this.categories = data;
      this.optionalCategories = data;
      this.categories = this.categories.map((c) => {
        c.selected = false;
        return c;
      });
      this.optionalCategories = this.optionalCategories.map((c) => {
        c.selected = false;
        return c;
      });
    }
  }

  selectCategory(event) {
    const cat_id = Number(event.target.value);
    const index = this.categories.findIndex((item) => item.id === cat_id);
    if (index !== -1) {
      const category = this.categories[index];
      this.sub_categories = category.sub_categories;
    }
  }

  selectSubCategoryOption(id) {
    if (this.option_values) {
      while (this.addProductForm.get("option_values").value.length > 0) {
        this.option_values.removeAt(0);
      }
      this.option_values.reset();
    }

    const cat_id = Number(id);
    const index = this.sub_categories.findIndex((item) => item.id === cat_id);
    if (index !== -1) {
      this.options = this.sub_categories[index].options;
      this.options.forEach((element) => {
        this.addOptions(element);
      });
    }
  }

  selectOptionalCategory(event) {
    const cat_id = Number(event.target.value);
    const index = this.optionalCategories.findIndex(
      (item) => item.id === cat_id
    );
    if (index !== -1) {
      const optionalCategory = this.optionalCategories[index];
      this.optionalSubCategories = optionalCategory.sub_categories;
    }
  }

  onQuantityFieldsChange() {
    if (
      this.addProductForm.get("max_per_order").value ||
      this.addProductForm.get("min_days").value
    ) {
      this.addProductForm
        .get("max_per_order")
        .setValidators([Validators.required]);
      this.addProductForm.get("min_days").setValidators([Validators.required]);
    } else {
      this.addProductForm.get("max_per_order").clearValidators();
      this.addProductForm.get("min_days").clearValidators();
    }

    this.addProductForm.get("max_per_order").updateValueAndValidity();
    this.addProductForm.get("min_days").updateValueAndValidity();
  }

  onCategorySelect(category_id) {
    this.toggleCategorySelectedState(category_id, true);
  }

  toggleCategorySelectedState(category_id, selected) {
    const ind = this.categories.findIndex((c) => c.id == category_id);

    if (ind !== -1) {
      this.categories[ind].selected = selected;
    }
  }

  resetForm() {
    this.categories = [];
    this.sub_categories = [];
    if (this.categories) {
      this.categories.map((c) => {
        c.selected = false;
        return c;
      });
    }
    this.imageUrl = "";
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
