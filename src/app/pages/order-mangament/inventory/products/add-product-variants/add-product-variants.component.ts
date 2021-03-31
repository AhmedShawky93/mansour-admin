import {DraftProductService} from './../../../../services/draft-product.service';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UploadFilesService} from '@app/pages/services/upload-files.service';
import {ProductsService} from '@app/pages/services/products.service';
import {CategoryService} from '@app/pages/services/category.service';
import {ToastrService} from 'ngx-toastr';
import {OptionsService} from '@app/pages/services/options.service';
import {DateLessThan} from '@app/shared/date-range-validation';
import * as moment from 'moment';
import {NgxSpinnerService} from 'ngx-spinner';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {Observable, combineLatest, Subject, concat, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, switchMap, catchError, map} from 'rxjs/operators';
import {environment} from '@env/environment';

@Component({
  selector: 'app-add-product-variants',
  templateUrl: './add-product-variants.component.html',
  styleUrls: ['./add-product-variants.component.css']
})
export class AddProductVariantsComponent implements OnInit, OnChanges {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataProductEmit = new EventEmitter();
  @Input() selectedProduct;

  submitting: boolean;
  parentProduct: any;
  componentForm: FormGroup;
  options: FormArray;
  addSubImages: FormArray;
  price: any;
  categories: any;
  sub_categories: any;
  category_id: '';
  optionalCategories: any;
  optionalSubCategories: any;
  brands: any;
  subCategoryOptions: Array<any> = [];
  option_values: FormArray;
  allOptions: Array<any> = [];
  selectedVariantsOptions: Array<any>;
  mainProduct: any;
  editorConfig: AngularEditorConfig;
  relatedProducts: any = [];
  relatedProducts$: Observable<any>;
  relatedProductsInput$ = new Subject<String>();
  relatedProductsLoading: boolean;
  products: any = [];
  products$: Observable<any>;
  allOptions$: Observable<Object>;
  categories$: Observable<Object>;
  brands$: Observable<any>;
  productsInput$ = new Subject<String>();
  productsLoading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private uploadFile: UploadFilesService,
    private productsService: ProductsService,
    private categoriesService: CategoryService,
    private toasterService: ToastrService,
    private optionsService: OptionsService,
    private spinner: NgxSpinnerService,
    private draftProductService: DraftProductService
  ) {
    this.allOptions$ = this.optionsService.getOptions();
    this.categories$ = this.categoriesService.getCategories();
    this.brands$ = this.productsService.getBrands();
    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: '175px',
      minHeight: '5rem',
      maxHeight: 'auto',
      width: '100%',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      sanitize: false,
      toolbarPosition: 'top',
      uploadUrl: environment.api + '/admin/upload_ckeditor',
    };
  }

  ngOnInit() {
    this.getInitialData();
  }

  ngOnChanges() {
    this.setForm(this.selectedProduct);
  }

  getInitialData() {
    this.spinner.show();
    combineLatest(this.allOptions$, this.categories$, this.brands$)
      .subscribe(
        ([options, categories, brands]) => {
          this.getAllOptions(options);
          this.getCategories(categories);
          this.getBrands(brands);
          this.mergeData(this.selectedProduct);
          this.setData(this.selectedProduct);
          this.spinner.hide();
        },
        () => this.spinner.hide()
      );
  }

  closeSideBar() {
    this.componentForm.reset();
    this.closeSideBarEmit.emit();
  }

  setForm(data) {
    this.componentForm = this.formBuilder.group({
      brand_id: new FormControl(data ? data.brand_id : ''),
      main_category: new FormControl(data ? (data.main_category) : ''),
      category: new FormControl(''),
      category_id: new FormControl(data ? (data.category_id) : '', Validators.required),
      optional_category: new FormControl(data ? (data.optional_category) : ''),
      optional_sub_category_id: new FormControl(data ? (data.optional_sub_category_id) : ''),
      preorder: new FormControl(data ? data.preorder : 0),
      preorder_start_date: new FormControl(data ? data.preorder_start_date : '', []),
      preorder_start_time: new FormControl(data ? data.preorder_start_time : '00:00:00', []),
      preorder_end_date: new FormControl(data ? data.preorder_end_date : '', []),
      preorder_expiration_time: new FormControl(data ? data.preorder_expiration_time : '00:00:00', []),
      available_soon: new FormControl(data ? data.available_soon : ''),
      max_per_order: new FormControl(data ? data.max_per_order : ''),
      min_days: new FormControl(data ? data.min_days : ''),
      stock_alert: new FormControl(data ? data.stock_alert : ''),
      order: new FormControl(data ? data.order : ''),
      option_values: this.formBuilder.array([]),
      discount_start_date: new FormControl(data ? data.discount_start_date : '', []),
      start_time: new FormControl(data ? data.start_time : '00:00:00', []),
      discount_end_date: new FormControl(data ? data.discount_end_date : '', []),
      expiration_time: new FormControl(data ? data.expiration_time : '00:00:00', []),
      product_variant_options: new FormControl(data ? data.product_variant_options : '', []),

      image: new FormControl(data ? data.image : '', Validators.required),
      video: new FormControl(data ? data.video : ''),
      images: this.formBuilder.array([]),
      name: new FormControl(data ? data.name : '', Validators.required),
      name_ar: new FormControl(data ? data.name_ar : '', Validators.required),
      description: new FormControl(data ? data.description : '', [
        Validators.required,
        Validators.minLength(3),
        // Validators.maxLength(250),
      ]),
      description_ar: new FormControl(data ? data.name_ar : '', [
        Validators.required,
        Validators.minLength(3),
        // Validators.maxLength(250),
      ]),
      long_description_en: new FormControl(data ? data.long_description_en : ''),
      long_description_ar: new FormControl(data ? data.long_description_ar : ''),
      meta_title: new FormControl(data ? data.meta_title : ''),
      meta_description: new FormControl(data ? data.meta_description : ''),
      meta_title_ar: new FormControl(data ? data.meta_title_ar : ''),
      meta_description_ar: new FormControl(data ? data.meta_description_ar : ''),
      price: new FormControl(data ? data.price : '', Validators.required),
      discount_price: new FormControl(data ? data.discount_price : '', [
        Validators.min(1), (control: AbstractControl) => Validators.max(this.price)(control)
      ]),
      default_variant: new FormControl(data ? data.default_variant : 0),
      stock: new FormControl(data ? data.stock : 0, Validators.required),
      // preorder_price: new FormControl(0),
      weight: new FormControl(data ? data.weight : 0, [Validators.min(1), Validators.required]),
      sku: new FormControl(data ? data.sku : '', Validators.required),
      options: this.formBuilder.array([]),
      type: new FormControl(data ? data.type : '', Validators.required),
      has_stock: new FormControl(data ? data.has_stock : ''),
      bundle_checkout: new FormControl(data ? data.bundle_checkout : ''),
      bundle_products_ids: new FormControl(data ? data.bundle_products_ids : ''),
      related_ids: new FormControl((data && data.related_ids) ? data.related_ids : ''),
    }, {validator: DateLessThan('discount_start_date', 'discount_end_date')});
  }

  mergeData(data) {
    let bundleProducts = [];
    let relatedProducts = [];
    if (data && data.bundle_products_ids) {
      bundleProducts = data.bundle_products_ids.map(bp => {
        return {
          id: bp.id,
          name: bp.name
        };
      });
    }
    if (data && data.related_ids) {
      relatedProducts = data.related_ids.map(bp => {
        return {
          id: bp.id,
          name: bp.name
        };
      });
    }


    this.products$ = concat(
      of(bundleProducts), // default items
      this.productsInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.productsLoading = true)),
        switchMap((term) =>
          this.productsService.searchProducts({q: term, variant: 1}, 1).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.productsLoading = false)),
            map((response: any) => {
              return response.data.products.map((p) => {
                return {
                  id: p.id,
                  name: p.sku + ': ' + p.name,
                };
              });
            })
          )
        )
      )
    );

    this.relatedProducts$ = concat(
      of(relatedProducts), // default items
      this.relatedProductsInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.relatedProductsLoading = true)),
        switchMap((term) =>
          this.productsService.searchProducts({q: term, variant: 1}, 1).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.relatedProductsLoading = false)),
            map((response: any) => {
              const products = response.data.products.map((p) => {
                return {
                  id: p.id,
                  name: p.sku + ': ' + p.name,
                };
              });
              return products;
            })
          )
        )
      )
    );
  }

  setData(data) {
    if (data) {
      this.selectCategory(data.main_category);
      this.selectSubCategoryOption(data.category_id);
      this.selectOptionalCategory(data.optional_category);
      this.setVariantOptionsToForm(data.options);
      const category = (data.main_category) ? this.categories.find(item => item.id === Number(data.main_category)) : '';
      this.componentForm.get('category').setValue(category);
      data.option_values.forEach((element) => {
        this.editOptions(element);
      });
      data.images.forEach(img => {
        this.addImage(img);
      });
    }
  }

  SetDraftProduct(event) {
    event.stopPropagation();
    let msg: string;
    const data = {...this.componentForm.value};

    if (!this.validateDraftData(data)) {
      this.toasterService.warning('Please fill at least one field');
      return;
    }

    if (this.selectedProduct) {
      data.id = this.selectedProduct.id;
      msg = 'Product added to draft';
    } else {
      msg = 'Draft Product Updated Successfully';
    }
    data.isDraft = true;
    const category = (data.main_category) ? this.categories.find(item => item.id === Number(data.main_category)) : '';
    this.componentForm.get('category').setValue(category);
    this.draftProductService.SetDraftProduct(data);
    this.dataProductEmit.emit(data);
    this.closeSideBar();
    this.toasterService.success(msg);
  }

  validateDraftData(data) {
    let hasData: boolean;
    Object.keys(data).forEach(key => {
      if (data[key] && (data[key].length !== 0) && data[key] !== '00:00:00') {
        hasData = true;
      } else if (data[key].length && data[key].length > 0 && data[key] !== '00:00:00') {
        hasData = true;
      }
    });
    return hasData;
  }

  getAllOptions(res) {
    if (res['code'] === 200) {
      this.allOptions = res['data'];
      console.log('allOptions', this.allOptions);
    } else {
      this.toasterService.error(res['message']);
    }
  }

  getCategories(response: any) {
    if (response.code === 200) {
      this.categories = response.data;
      this.optionalCategories = response.data;
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

  getBrands(response: any) {
    this.brands = response.data;
  }

  addOptions(data): void {
    this.option_values = this.componentForm.get('option_values') as FormArray;
    this.option_values.push(this.createItemOptions(data));
  }

  createItemOptions(data): FormGroup {
    return this.formBuilder.group({
      type: new FormControl((data) ? data.type : ''),
      option_id: new FormControl((data) ? data.id : ''),
      name_en: new FormControl((data) ? data.name_en : ''),
      optionValues: new FormControl((data) ? data.values : ''),
      option_value_id: new FormControl((data.option_value_id) ? data.option_value_id : ''),
      input_en: new FormControl(''),
      input_ar: new FormControl(''),
    });
  }

  editOptions(data): void {
    this.option_values = this.componentForm.get('option_values') as FormArray;
    this.option_values.push(this.editItemOptions(data));
  }

  editItemOptions(data): FormGroup {
    const group = this.formBuilder.group({
      type: new FormControl((data) ? data.type : ''),
      option_id: new FormControl((data && data.id) ? data.id : (data.option_id) ? data.option_id : ''),
      name_en: new FormControl((data) ? data.name_en : ''),
      optionValues: new FormControl((data && data.values && data.values.length) ? data.values : (data.optionValues) ? data.optionValues : ''),
      option_value_id: new FormControl((data.option_value_id) ? data.option_value_id : ''),
      input_en: new FormControl((data && data.input_en) ? data.input_en : ''),
      input_ar: new FormControl((data && data.input_ar) ? data.input_ar : '')
    });
    return group;
  }

  selectCategory(id) {
    if (id) {
      const cat_id = Number(id);
      const index = this.categories.findIndex((item) => item.id === cat_id);
      if (index !== -1) {
        const category = this.categories[index];
        this.sub_categories = category.sub_categories;
      }
    }
  }

  selectSubCategoryOption(id) {
    if (id) {
      if (this.option_values) {

        while (this.componentForm.get('option_values').value.length > 0) {
          this.option_values.removeAt(0);
        }
        this.option_values.reset();
      }
      const cat_id = Number(id);
      const index = this.sub_categories.findIndex((item) => item.id === cat_id);

      if (index !== -1) {
        this.subCategoryOptions = this.sub_categories[index].options;
        console.log('This subCategoryOptions >>>>', this.subCategoryOptions);

        if (!this.selectedProduct) {
          this.subCategoryOptions.forEach((element) => {
            this.addOptions(element);
          });
        }

      }
    }
  }

  selectOptionalCategory(id) {
    if (id) {
      const cat_id = Number(id);
      const index = this.optionalCategories.findIndex((item) => item.id === cat_id);
      if (index !== -1) {
        const optionalCategory = this.optionalCategories[index];
        this.optionalSubCategories = optionalCategory.sub_categories;
      }
    }
  }

  formatDateForSaving(data, form) {
    if (data.discount_end_date) {
      data.discount_end_date = moment(form.get('discount_end_date').value).format('YYYY-MM-DD');
      data.discount_end_date = data.discount_end_date + ' ' + form.get('expiration_time').value;
      data.discount_end_date = moment(data.discount_end_date).format('YYYY-MM-DD HH:mm');
    } else {
      data.discount_end_date = null;
    }

    if (data.discount_start_date) {
      data.discount_start_date = moment(form.get('discount_start_date').value).format('YYYY-MM-DD');
      data.discount_start_date = data.discount_start_date + ' ' + form.get('start_time').value;
      data.discount_start_date = moment(data.discount_start_date).format('YYYY-MM-DD HH:mm');
    } else {
      data.discount_start_date = null;
    }
  }

  onQuantityFieldsChange() {
    if (
      this.componentForm.get('max_per_order').value ||
      this.componentForm.get('min_days').value
    ) {
      this.componentForm
        .get('max_per_order')
        .setValidators([Validators.required]);
      this.componentForm.get('min_days').setValidators([Validators.required]);
    } else {
      this.componentForm.get('max_per_order').clearValidators();
      this.componentForm.get('min_days').clearValidators();
    }

    this.componentForm.get('max_per_order').updateValueAndValidity();
    this.componentForm.get('min_days').updateValueAndValidity();
  }

  buildVariantsOptions() {
    this.selectedVariantsOptions = this.componentForm.value.product_variant_options;
    this.addVariantOptionsToForm();
  }

  removeOption(data) {
    (<FormArray>this.componentForm.controls.options).removeAt(
      this.componentForm.controls.options.value.findIndex(
        (option) => option.optionData.id === data.value.id
      )
    );
  }

  formValidator() {
    if (!this.componentForm.valid) {
      this.markFormGroupTouched(this.componentForm);
      this.toasterService.error('Please fill all required fields');
      return false;
    } else {
      return true;
    }
  }

  formControlValidator(controlName, err) {
    if (this.componentForm.controls[controlName].touched && this.componentForm.controls[controlName].dirty) {
      if (this.componentForm.controls[controlName].errors) {
        return this.componentForm.controls[controlName].errors[err];
      }
    }
  }

  formGroupControlsValidator(formGroup, controlName, err) {
    if (formGroup.controls[controlName].touched && formGroup.controls[controlName].dirty) {
      if (formGroup.controls[controlName].errors) {
        return formGroup.controls[controlName].errors[err];
      }
    }
  }

  changeValidation() {
    // if (this.componentForm.value.preorder) {
    //   this.componentForm.get('preorder_price').setValidators([Validators.required]);
    //   this.componentForm.get('preorder_price').updateValueAndValidity();
    // } else if (!this.componentForm.value.preorder) {
    //   this.componentForm.get('preorder_price').clearValidators();
    //   this.componentForm.get('preorder_price').updateValueAndValidity();
    // }
  }

  addVariantOptionsToForm() {
    if (this.selectedVariantsOptions.length) {
      this.selectedVariantsOptions.forEach(item => {
        this.options = this.componentForm.get('options') as FormArray;
        this.options.push(this.createVariantOption(item));
      });
    }
  }

  createVariantOption(item): FormGroup {
    if (item.type === '4') {
      return this.formBuilder.group({
        optionData: item,
        option_id: new FormControl(item.id, [Validators.required]),
        option_value_id: new FormControl((item.selectedValue) ? item.selectedValue.id : '', [Validators.required]),
        option_image: new FormControl((item.selectedValue) ? item.selectedValue.image : '', [Validators.required])
      });
    } else if (item.type === '5') {
      return this.formBuilder.group({
        optionData: item,
        option_id: new FormControl(item.id, [Validators.required]),
        option_value_id: new FormControl((item.selectedValue) ? item.selectedValue.id : ''),
        input_ar: new FormControl((item.selectedValue) ? item.selectedValue.input_ar : '', [Validators.required]),
        input_en: new FormControl((item.selectedValue) ? item.selectedValue.input_en : '', [Validators.required])
      });
    } else {
      return this.formBuilder.group({
        optionData: item,
        option_id: new FormControl(item.id, Validators.required),
        option_value_id: new FormControl((item.selectedValue) ? item.selectedValue.id : '', [Validators.required])
      });
    }

  }

  setVariantOptionsToForm(data) {
    data.forEach(item => {
      this.options = this.componentForm.get('options') as FormArray;
      this.options.push(this.setVariantOption(item));
    });
  }

  setVariantOption(item): FormGroup {
    if (item.optionData.type === '4') {
      return this.formBuilder.group({
        optionData: item.optionData,
        option_id: new FormControl(item.option_id, [Validators.required]),
        option_value_id: new FormControl((item.option_value_id) ? Number(item.option_value_id) : '', [Validators.required]),
        option_image: new FormControl((item.option_image) ? item.option_image : '', [Validators.required])
      });
    } else if (item.optionData.type === '5') {
      return this.formBuilder.group({
        optionData: item.optionData,
        option_id: new FormControl(item.option_id, [Validators.required]),
        option_value_id: new FormControl((item.option_value_id) ? Number(item.option_value_id) : ''),
        input_ar: new FormControl((item.input_ar) ? item.input_ar : '', [Validators.required]),
        input_en: new FormControl((item.input_en) ? item.input_en : '', [Validators.required])
      });
    } else {
      return this.formBuilder.group({
        optionData: item.optionData,
        option_id: new FormControl(item.option_id, Validators.required),
        option_value_id: new FormControl((item.option_value_id) ? Number(item.option_value_id) : '', [Validators.required])
      });
    }

  }

  addImage(data: any = null) {
    this.addSubImages = this.componentForm.get('images') as FormArray;
    this.addSubImages.push(this.createImageFormControl(data));
  }

  createImageFormControl(data): FormGroup {
    return this.formBuilder.group({
      url: new FormControl(data ? data.url : ''),
    });
  }

  mappingMainProductData() {
    const product = {...this.componentForm.value};
    product.option_values.forEach(item => {
      delete item.optionValues;
      delete item.name_en;
    });

    if (product.preorder_end_date) {
      product.preorder_end_date = moment(this.componentForm.get('preorder_end_date').value).format('YYYY-MM-DD');
      product.preorder_end_date = product.preorder_end_date + ' ' + this.componentForm.get('preorder_expiration_time').value;
      product.preorder_end_date = moment(product.preorder_end_date).format('YYYY-MM-DD HH:mm');
    } else {
      product.preorder_end_date = null;
    }

    if (product.preorder_start_date) {
      product.preorder_start_date = moment(this.componentForm.get('preorder_start_date').value).format('YYYY-MM-DD');
      product.preorder_start_date = product.preorder_start_date + ' ' + this.componentForm.get('preorder_start_time').value;
      product.preorder_start_date = moment(product.preorder_start_date).format('YYYY-MM-DD HH:mm');
    } else {
      product.preorder_start_date = null;
    }

    const data = {
      brand_id: product.brand_id,
      category_id: product.category_id,
      max_per_order: product.max_per_order,
      min_days: product.min_days,
      name: product.name,
      name_ar: product.name_ar,
      // option_values: product.option_values,
      optional_category: product.optional_category,
      optional_sub_category_id: product.optional_sub_category_id,
      preorder: product.preorder,
      available_soon: !!product.available_soon,
      product_variant_options: (product.product_variant_options.length) ? product.product_variant_options.map(item => item.id) : '',
      sku: product.sku,
      stock_alert: product.stock_alert,
      type: product.type,
      has_stock: product.has_stock,
      bundle_checkout: product.bundle_checkout,
      preorder_start_date: product.preorder_start_date,
      preorder_end_date: product.preorder_end_date,
      related_ids: product.related_ids ? product.related_ids.map(item => item.id) : ''
    };
    return data;
  }

  createMainProduct() {
    this.submitting = true;
    this.productsService.creatProduct(this.mappingMainProductData())
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.mainProduct = response.data;
          this.createVariantProduct();
        } else {
          this.spinner.hide();
          this.toasterService.error(response.message);
          // this.productsService.deleteProduct()
        }
        this.submitting = false;
      });
  }

  mappingVariantData() {
    const product = {...this.componentForm.value};

    product.options.forEach(item => {
      delete item.optionData;
    });
    this.formatDateForSaving(product, this.componentForm);

    const data = {
      default_variant: product.default_variant,
      description: product.description,
      description_ar: product.description_ar,
      discount_end_date: product.discount_end_date,
      discount_price: product.discount_price,
      discount_start_date: product.discount_start_date,
      expiration_time: product.expiration_time,
      start_time: product.start_time,
      image: product.image,
      video: product.video,
      images: product.images,
      order: product.order,
      long_description_ar: product.long_description_ar,
      long_description_en: product.long_description_en,
      name: product.name,
      name_ar: product.name_ar,
      meta_title: product.meta_title,
      meta_description: product.meta_description,
      meta_title_ar: product.meta_title_ar,
      meta_description_ar: product.meta_description_ar,
      options: product.options,
      option_values: product.option_values,
      // preorder_price: product.preorder_price,
      price: product.price,
      sku: product.sku + '_variant',
      stock: product.stock,
      weight: product.weight,
      bundle_products_ids: (product.bundle_products_ids) ? product.bundle_products_ids.map(item => item.id) : '',
    };
    return data;
  }

  createVariantProduct() {
    this.submitting = true;
    this.productsService.creatProductVariant(this.mainProduct.id, this.mappingVariantData())
      .subscribe((response: any) => {
        if (response.code === 200) {
          const deleteDraft = {...this.selectedProduct};
          deleteDraft.delete = true;
          this.dataProductEmit.emit(this.mainProduct);
          this.draftProductService.clearDraftProduct(this.selectedProduct);
          this.dataProductEmit.emit(deleteDraft);
          this.toasterService.success('Product With Variant Created Successfully');
          this.spinner.hide();
          this.closeSideBar();
        } else {
          this.spinner.hide();
          this.toasterService.error(response.message);
          this.productsService.deleteProduct(this.mainProduct.id);
        }
        this.submitting = false;
      });
  }

  save() {
    /*Check Is Valid Form Data & Fire Validation*/
    if (this.formValidator()) {
      this.spinner.show();
      this.createMainProduct();
    }
  }

  onTypeChanged() {
    if (this.componentForm.value.type == 2) {
      this.componentForm.get('bundle_products_ids').setValidators([Validators.required]);
    } else {
      this.componentForm.get('bundle_products_ids').clearValidators();
    }

    this.componentForm.get('bundle_products_ids').updateValueAndValidity();
  }

  onAvailableChange() {
    console.log(this.componentForm.value.available_soon);
    if (this.componentForm.value.available_soon) {
      this.componentForm.get('price').clearValidators();
    } else {
      this.componentForm.get('price').setValidators([Validators.required]);
    }

    this.componentForm.get('price').updateValueAndValidity();
  }

  markFormGroupTouched(formGroup: FormGroup) {
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

  removeImage(index) {
    this.addSubImages.removeAt(index);
  }
}
