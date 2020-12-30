import { ProductsService } from "@app/pages/services/products.service";
import { CategoryService } from "@app/pages/services/category.service";
import { UploadFilesService } from "@app/pages/services/upload-files.service";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from "@angular/core";
import {
  FormGroup,
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Console } from "@angular/core/src/console";

@Component({
  selector: "app-add-edit-product",
  templateUrl: "./add-edit-product.component.html",
  styleUrls: ["./add-edit-product.component.css"],
})
export class AddEditProductComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataProductEmit = new EventEmitter();
  @Input("selectProductDataEdit") selectProductDataEdit;
  addProductForm: FormGroup;
  addSubImages: FormArray;
  deleted_images: any;
  imageUrl: any;
  showError: number;
  selectImages: File;
  categories: any;
  sub_categories: any;
  category_id: "";
  brands: any;

  submitting: boolean;
  loading: boolean;
  options = [];
  option_values: FormArray;

  price: number;

  constructor(
    private formBuilder: FormBuilder,
    private uploadFile: UploadFilesService,
    private productsService: ProductsService,
    private _CategoriesService: CategoryService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {

    this.getForm(this.selectProductDataEdit);
  }
  ngOnChanges() {
    this.getCategories();
    this.productsService.getBrands().subscribe((response: any) => {
      this.brands = response.data;
    });

    console.log(this.selectProductDataEdit);
    this.getForm(this.selectProductDataEdit);
  }

  getForm(data) {
    console.log(data);
    this.addProductForm = this.formBuilder.group({
      name: new FormControl(data ? data.name : "", Validators.required),
      name_ar: new FormControl(data ? data.name_ar : "", Validators.required),
      description: new FormControl(data ? data.description : "", [
        Validators.required,
        Validators.minLength(3)
      ]),
      description_ar: new FormControl(data ? data.description_ar : "", [
        Validators.required,
        Validators.minLength(3)
      ]),
      long_description_en: new FormControl(
        data ? data.long_description_en : ""
      ),
      long_description_ar: new FormControl(
        data ? data.long_description_ar : ""
      ),
      meta_title: new FormControl(
        data ? data.meta_title : ""
      ),
      meta_description: new FormControl(
        data ? data.meta_description : ""
      ),
      keywords: new FormControl(
        data ? data.keywords : ""
      ),
      price: new FormControl(data ? data.price : "", Validators.required),
      discount_price: new FormControl(data ? data.discount_price : "", [
        Validators.min(1),
        (control: AbstractControl) => Validators.max(this.price)(control)
      ]),
      brand_id: new FormControl(data ? data.brand_id : ""),
      main_category: new FormControl(
        data && data.category ? data.category.id : ""
      ),
      category_id: new FormControl(
        data ? data.category_id : "",
        Validators.required
      ),
      stock: new FormControl(data ? data.stock : 0, Validators.required),
      sku: new FormControl(data ? data.sku : "", Validators.required),
      image: new FormControl(data ? data.image : "", Validators.required),
      images: this.formBuilder.array(data ? data.images : []),
      max_per_order: new FormControl(data ? data.max_per_order : ""),
      min_days: new FormControl(data ? data.min_days : ""),
      stock_alert: new FormControl(data ? data.stock_alert : ""),
      order: new FormControl(data ? data.order : ""),
      option_values: this.formBuilder.array([]),
    });
    // this.addProductForm.setControl('images', this.formBuilder.array(data.images || []));

    if (data) {
      this.imageUrl = data.image;
      const cat_id = data.category.id;
      let index = this.categories.findIndex((item) => item.id == cat_id);
      this.categories[index].selected = true;
      let category = this.categories[index];
      this.sub_categories = category.sub_categories;
      if (data.options.length) {
        // this.selectSubCategoryOption(data.category.sub_categories[0].id);

        data.options.forEach((element) => {
          this.options.push(element.option)
          this.addOptionsEdit(element);
          console.log(element)
        })

      }

      if (data.image) {
        console.log("clearValidators");
        this.addProductForm.get("image").clearValidators();
        // this.addProductForm.get("image").patchValue(data.image);
        this.addProductForm.get("image").updateValueAndValidity();
        this.addProductForm.updateValueAndValidity();
      }

    }
  }

  closeSideBar() {
    this.closeSideBarEmit.emit();
    if (this.selectProductDataEdit == undefined) {
      this.resetForm();
      this.addProductForm.reset();
      if (this.option_values) {
        while (this.addProductForm.get("option_values").value.length > 0) {
          this.option_values.removeAt(0);
        }
        this.option_values.reset()
      }
    }
  }

  addImage(): void {
    if (this.addProductForm.get("images").value.length < 4) {
      this.addSubImages = this.addProductForm.get("images") as FormArray;
      this.addSubImages.push(this.createItem());
      console.log(this.addProductForm.get("images").value.length);
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
      option_id: data.id,
      id: new FormControl(''),
      input_en: new FormControl(''),
      input_ar: new FormControl(''),
    });
  }
  addOptionsEdit(data): void {
    this.option_values = this.addProductForm.get("option_values") as FormArray;
    this.option_values.push(this.createItemOptionsEdit(data));
  }

  createItemOptionsEdit(data): FormGroup {
    return this.formBuilder.group({
      option_id: data.option.id,
      option_value_id: new FormControl(''),
      input_en: new FormControl(data ? data.value.input_en : ''),
      input_ar: new FormControl(data ? data.value.input_ar : ''),
    });
  }

  removeImage(product, index) {
    const images = this.addProductForm.get("images").value;
    console.log(product.value, index);
    if (product.id) {
      this.deleted_images.push(product.images[index].id);
    }
    this.addSubImages.removeAt(index);
  }

  onimgeSelected(form: FormGroup, event) {
    if (event.target.value) {
      this.loading = true;
      const selectFile = <File>event.target.files[0];
      var reader = new FileReader();
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
    console.log(this.addProductForm.value)
    if (this.selectProductDataEdit) {
      // edit

      const product = this.addProductForm.value;
      product.image = this.imageUrl;
      console.log(product);

      if (product.image) {
        console.log("clearValidators");
        this.addProductForm.get("image").clearValidators();
        this.addProductForm.get("image").updateValueAndValidity();
      }
      if (this.imageUrl) {
        console.log("clearValidators");
        this.addProductForm.get("image").clearValidators();
        // this.addProductForm.get("image").patchValue(data.image);
        this.addProductForm.get("image").updateValueAndValidity();
        this.addProductForm.updateValueAndValidity();
      }
      console.log(this.addProductForm.value);
      console.log(this.addProductForm.valid);
      if (!this.addProductForm.valid) {
        this.markFormGroupTouched(this.addProductForm);
        return;
      }
      this.submitting = true;
      this.productsService
        .updateProduct(this.selectProductDataEdit.id, product)
        .subscribe((response: any) => {
          if (response.code == 200) {
            this.addProductForm.reset();
            this.dataProductEmit.emit(response.data);
            this.closeSideBar();
          } else {
            this.toastrService.error(response.message);
          }
          this.submitting = false;
        });
    } else {
      // add
      const product = this.addProductForm.value;
      product.image = this.imageUrl;
      delete product.main_category;
      console.log(this.addProductForm.value);
      console.log(this.addProductForm.valid);
      if (this.addProductForm.invalid) {
        this.markFormGroupTouched(this.addProductForm);
        console.log(this.addProductForm.errors);
        return;
      }
      this.submitting = true;

      this.productsService.creatProduct(product).subscribe((response: any) => {
        if (response.code == 200) {
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

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object)
      .values(formGroup.controls)
      .forEach((control: FormGroup, ind) => {
        control.markAsTouched();

        if (control.controls) {
          this.markFormGroupTouched(control);
        }
      });
  }

  getCategories() {
    this._CategoriesService.getCategories().subscribe((response: any) => {
      if (response.code === 200) {
        this.categories = response.data;
        this.categories = this.categories.map((c) => {
          c.selected = false;
          return c;
        });
        console.log('this.categories  => ', this.categories)
        console.log('response.data  => ', response.data)
      }
    });
  }

  selectCategory(event) {
    const cat_id = event.target.value;
    let index = this.categories.findIndex((item) => item.id == cat_id);
    if (index !== -1) {
      let category = this.categories[index];
      this.sub_categories = category.sub_categories;
      console.log(this.sub_categories);
    }
  }
  selectSubCategoryOption(id) {
    if (this.option_values) {

      while (this.addProductForm.get("option_values").value.length > 0) {
        this.option_values.removeAt(0);
      }
      this.option_values.reset()
    }
    console.log(this.addProductForm.get("option_values"))

    console.log(id);
    const cat_id = id
    console.log(this.sub_categories);
    let index = this.sub_categories.findIndex((item) => item.id == cat_id);
    console.log(index);
    if (index !== -1) {
      console.log(index);
      this.options = this.sub_categories[index].options;
      console.log(this.options);
      this.options.forEach((element) => {
        this.addOptions(element);
      });
    }
  }
  selectOptionValue(option, value, index) {
    console.log(option, value, index);
    // this.addProductForm.get("option_values").value[index].option_id = option.id;
    console.log(this.addProductForm.get("option_values").value);
  }
  takeInputId(option, index) {
    console.log(option, index);
    // this.addProductForm.get("option_values").value[index].option_id = option.id;
    console.log(this.addProductForm.get("option_values").value);
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
    console.log(category_id);
    this.toggleCategorySelectedState(category_id, true);
  }

  toggleCategorySelectedState(category_id, selected) {
    let ind = this.categories.findIndex((c) => c.id == category_id);

    if (ind !== -1) {
      this.categories[ind].selected = selected;
    }

    console.log(this.categories);
  }

  resetForm() {
    this.categories = []
    this.sub_categories = []
    console.log("resetting");
    if (this.categories) {
      this.categories.map((c) => {
        c.selected = false;
        return c;
      });
    }
    this.imageUrl = "";
  }
}
