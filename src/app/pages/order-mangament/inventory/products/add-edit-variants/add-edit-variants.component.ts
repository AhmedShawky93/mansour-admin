import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UploadFilesService} from '@app/pages/services/upload-files.service';
import {ProductsService} from '@app/pages/services/products.service';
import {CategoryService} from '@app/pages/services/category.service';
import {ToastrService} from 'ngx-toastr';
import {OptionsService} from '@app/pages/services/options.service';
import {DateLessThan} from '@app/shared/date-range-validation';
import * as moment from 'moment';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import { Observable, Subject, concat, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';


@Component({
  selector: 'app-add-edit-variants',
  templateUrl: './add-edit-variants.component.html',
  styleUrls: ['./add-edit-variants.component.css']
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

  products: any = [];
  products$: Observable<any>;
  productsInput$ = new Subject<String>();
  productsLoading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private uploadFile: UploadFilesService,
    private productsService: ProductsService,
    private _CategoriesService: CategoryService,
    private toasterService: ToastrService,
    private optionsService: OptionsService
  ) {
    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: '175px',
      minHeight: '5rem',
      placeholder: 'Enter text here...',
      translate: 'no',
      uploadUrl: 'v1/images', // if needed
      customClasses: [ // optional
        /*{
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },*/
      ]
    };
  }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('parentProduct', this.parentProduct);
    console.log('selectedVariant', this.selectVariant);
    this.setForm(this.selectVariant);
    this.setData(this.selectVariant);
  }

  closeSideBar() {
    this.variantForm.reset();
    this.closeSideBarEmit.emit();
  }

  setForm(data) {
    this.variantForm = this.formBuilder.group({
      image: new FormControl(data ? data.image : '', Validators.required),
      video: new FormControl(data ? data.video : ''),
      images: this.formBuilder.array([]),
      name: new FormControl(data ? data.name : '', Validators.required),
      name_ar: new FormControl(data ? data.name_ar : '', Validators.required),
      description: new FormControl(data ? data.description : '', [
        Validators.required,
      ]),
      description_ar: new FormControl(data ? data.description_ar : '', [
        Validators.required,
      ]),
      long_description_en: new FormControl(data ? data.long_description_en : ''),
      long_description_ar: new FormControl(data ? data.long_description_ar : ''),
      meta_title: new FormControl(data ? data.meta_title : ''),
      meta_description: new FormControl(data ? data.meta_description : ''),
      price: new FormControl(data ? data.price : '', Validators.required),
      discount_price: new FormControl(data ? data.discount_price : '', [
        Validators.min(1), (control: AbstractControl) => Validators.max(this.price)(control)
      ]),
      default_variant: new FormControl(data ? data.default_variant : 0),
      bundle_products_ids: new FormControl(data ? data.bundleProducts.map(bp => bp.id) : []),
      stock: new FormControl(data ? data.stock : 0, Validators.required),
      preorder: new FormControl(data ? data.preorder : 0),
      // preorder_price: new FormControl(data ? data.preorder_price : 0),
      weight: new FormControl(data ? data.weight : 0, Validators.required),
      /*stock_alert: new FormControl(data ? data.stock_alert : ''),*/
      sku: new FormControl(data ? data.sku : '', Validators.required),
      options: this.formBuilder.array([]),
      discount_start_date: new FormControl((data && data.discount_start_date) ? data.discount_start_date.split(' ')[0] : '', []),
      start_time: new FormControl((data && data.discount_start_date) ? data.discount_start_date.split(' ')[1] : '00:00:00', []),
      discount_end_date: new FormControl((data && data.discount_end_date) ? data.discount_end_date.split(' ')[0] : '', []),
      expiration_time: new FormControl((data && data.discount_end_date) ? data.discount_end_date.split(' ')[1] : '00:00:00', []),
    }, {validator: DateLessThan('discount_start_date', 'discount_end_date')});

    let bundleProducts = [];
    if (data && data.bundleProducts) {
      bundleProducts = data.bundleProducts.map(bp => {
        return {
          id: bp.id,
          name: bp.sku + ": " + bp.name
        }
      })
    }
    console.log("BP: ", bundleProducts);
    this.products$ = concat(
      of(bundleProducts), // default items
      this.productsInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => this.productsLoading = true),
        switchMap(term => this.productsService.searchProducts({q: term, variant: 1}, 1).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.productsLoading = false),
          map((response: any) => {
            return response.data.products.map(p => {
              return {
                id: p.id,
                name: p.sku + ": " + p.name
              }
            })
          })
        ))
      )
    );
  }

  setData(data) {
    this.addVariantOptionsToForm();
    this.changeValidation();
    if (data) {
      data.images.forEach(img => {
        this.addImage(img);
      });
    }
  }

  formValidator() {
    console.log('this.variantForm', this.variantForm.value);
    if (!this.variantForm.valid) {
      this.markFormGroupTouched(this.variantForm);
      return false;
    } else {
      return true;
    }
  }

  formControlValidator(controlName, err) {
    if (this.variantForm.controls[controlName].touched && this.variantForm.controls[controlName].dirty) {
      if (this.variantForm.controls[controlName].errors) {
        return this.variantForm.controls[controlName].errors[err];
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
    // if (this.variantForm.value.preorder) {
    //   this.variantForm.get('preorder_price').setValidators([Validators.required]);
    //   this.variantForm.get('preorder_price').updateValueAndValidity();
    // } else if (!this.variantForm.value.preorder) {
    //   this.variantForm.get('preorder_price').clearValidators();
    //   this.variantForm.get('preorder_price').updateValueAndValidity();
    // }
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

  addVariantOptionsToForm() {
    if (this.parentProduct && !this.selectVariant) {
      /*Case Create New*/
      this.parentProduct.product_variant_options.forEach(item => {
        this.options = this.variantForm.get('options') as FormArray;
        this.options.push(this.createVariantOption(item));
      });
    } else if (this.parentProduct && this.selectVariant) {
      /*Case Update*/
      const selectedOptions = this.selectVariant.product_variant_options.map(data => {
        return {option: data.option, selectedValue: data.values[0]};
      });

      this.parentProduct.product_variant_options.forEach(item => {
        const selected = selectedOptions.find(op => op.option.id === item.id);
        item['selectedValue'] = selected.selectedValue;
        this.options = this.variantForm.get('options') as FormArray;
        this.options.push(this.createVariantOption(item));
      });
    }
  }

  addImage(data: any = null) {
    this.addSubImages = this.variantForm.get('images') as FormArray;
    this.addSubImages.push(this.createImageFormControl(data));
  }

  createImageFormControl(data): FormGroup {
    return this.formBuilder.group({
      url: new FormControl(data ? data.url : ''),
    });
  }

  createProduct(product) {
    this.submitting = true;
    this.productsService.creatProductVariant(this.parentProduct.id, product)
      .subscribe((response: any) => {
        if (response.code === 200) {
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
    this.productsService.updateProductVariant(this.parentProduct.id, this.selectVariant.id, product)
      .subscribe((response: any) => {
        if (response.code === 200) {
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
    data.options.forEach(item => {
      delete item.optionData;
    });
    this.formatDateForSaving(data, this.variantForm);
    return data;
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

  save() {
    /*Check Is Valid Form Data & Fire Validation*/
    if (this.formValidator()) {
      if (!this.selectVariant) {
        /*Case Create*/
        this.createProduct(this.mappingDataForSaving());
      } else {
        /*Case Update*/
        this.updateProduct(this.mappingDataForSaving());
      }
    }
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
