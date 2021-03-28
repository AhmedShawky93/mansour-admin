import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { Component, ElementRef, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '@app/pages/services/products.service';
import { CategoryService } from '@app/pages/services/category.service';
import 'rxjs/add/operator/take';
import { UploadFilesService } from '@app/pages/services/upload-files.service';
import { environment } from '@env/environment';
import { AuthService } from '@app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { animate, state, style, transition, trigger, } from '@angular/animations';

import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Rx';
import { tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounce } from 'lodash';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DraftProductService } from '@app/pages/services/draft-product.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translate3d(0px, 0, 0)',
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(-100%, 0, 0)',
        })
      ),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ProductsComponent implements OnInit, OnChanges {
  searchForm: FormGroup;
  searchValue: string;
  dateRange: any;
  showError: number;
  currentProduct: any;
  category_id: any;
  @ViewChild('myInput') importFile: ElementRef;
  @ViewChild('myInputStock') importFileStock: ElementRef;
  @ViewChild('productForm') productForm: AddEditProductComponent;

  selectedUserIds: number[];
  products: Array<any> = [];
  selectedMainProduct: any;
  public product: any = {
    name: '',
    description: '',
    brand_id: '',
    price: '',
    discount_price: '',
    sku: '',
    category_id: '',
    image: '',
    long_description_ar: '',
    long_description_en: '',
    option_values: [] = [],
    images: [],
  };
  addProductForm: FormGroup;

  toggleAddProduct = 'out';
  viewProductSidebar = 'out';

  toggleVariant: string;
  toggleProductVariant: string;
  viewVariantSidebar: string;

  selectProductData: any;
  selectProductDataView: any;

  selectedProductVariantData: any;
  selectedProductVariantBoth: any;
  categories: any;

  sub_categories = [];
  options: any[];
  selectFile = null;
  selectImages = null;
  total = 0;
  p = 1;
  exportUrl: string;
  exportStock: string;
  formProduct;
  brands = [];
  newPrdouct;
  sub_category_id = '';
  main_category = '';
  updateProductForm;
  filter$ = new Subject();
  loading: boolean;
  filter = {
    q: '',
    page: 1,
  };
  website_url: any;
  historyRoute: any;
  searchValueProduct: string;
  stateCloning: boolean;

  constructor(
    private productsService: ProductsService,
    private uploadFile: UploadFilesService,
    private _CategoriesService: CategoryService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService,
    private draftProductService: DraftProductService
  ) {
    this.search = debounce(this.search, 700);
    this.toggleVariant = 'out';
    this.toggleProductVariant = 'out';
    this.viewVariantSidebar = 'out';
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(event);
        this.getRoutes();
      }
    });
  }

  addCustomUser = (term) => ({ id: term, name: term });

  ngOnInit() {
    this.getCategories();
    // this.getProducts();
    this.productsService.getBrands().subscribe((response: any) => {
      this.brands = response.data;
    });

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(),
    });

    this.filter$
      .debounceTime(400)
      .pipe(tap((e) => (this.loading = true)))
      .switchMap((filter) => this.searchProducts())
      .subscribe((result: any) => {
        this.products = result.data.products;
        this.products = this.products.map((item) => {
          item.deactivated = !item.active;
          return item;
        });
        this.total = result.data.total;
      });

    $('.add-product').on('click', function () {
      $('#add-prod').toggleClass('open-view-vindor-types');
    });

    $('.edit-product').on('click', function () {
      $('#edit-prod').toggleClass('open-view-vindor-types');
    });

    $('.open-show').on('click', function () {
      $('#show-p-details').toggleClass('open-view-vindor-types');
    });

    $('.slider').on('click', function () {
      const then = $(this).siblings('.reason-popup').slideToggle(100);
      $('.reason-popup').not(then).slideUp(50);
    });

    $('#close-vindors1').on('click', function () {
      $('#add-prod').removeClass('open-view-vindor-types');
    });

    $('#close-vindors2').on('click', function () {
      $('#edit-prod').removeClass('open-view-vindor-types');
    });

    $('#show-p-details').on('click', '#close-vindors4', function () {
      $('#show-p-details').removeClass('open-view-vindor-types');
    });

    const token = this.auth.getToken();

    if (this.sub_category_id) {
      // console.log(this.sub_category_id);
      this.exportUrl = environment.api + '/admin/products/fullExport?sub_category_id=' + this.sub_category_id + '&token=' + token;
    } else {
      this.exportUrl = environment.api + '/admin/products/fullExport?token=' + token;
      // console.log(this.sub_category_id);
    }
    this.exportStock = environment.api + '/admin/products/export_prices?token=' + token;

    this.website_url = environment.website_url;

  }

  getRoutes() {
    if (this.route.snapshot.queryParams.pages) {
      this.p = this.route.snapshot.queryParams.pages;
    }
    if (this.route.snapshot.queryParams.search && !this.selectedMainProduct) {
      this.searchValue = this.route.snapshot.queryParams.search;
    }
    if (this.route.snapshot.queryParams.parent_id && !this.selectedMainProduct) {
      this.selectedMainProduct = { id: this.route.snapshot.queryParams.parent_id, name: this.route.snapshot.queryParams.parent_name }
    } else if (!this.route.snapshot.queryParams.parent_id && this.selectedMainProduct) {
      this.selectedMainProduct = null;
    }
    if (this.route.snapshot.queryParams.main_category) {
      this.main_category = this.route.snapshot.queryParams.main_category;

    }
    this.getProducts(this.selectedMainProduct ? this.selectedMainProduct : null, this.searchValue);
  }

  setRoute() {
    const params = { search: '', main_category: null, sub_category_id: null, page: 1, parent_id: null, parent_name: null }
    if (this.searchValue != '' && !this.selectedMainProduct) {
      params.search = this.searchValue
    }
    if (this.main_category) {
      params.main_category = this.main_category
    }
    if (this.sub_category_id && this.sub_category_id != '') {
      params.sub_category_id = this.sub_category_id
    }
    if (this.p != 1) {
      params.page = this.p
    }
    if (this.selectedMainProduct) {
      params.parent_id = this.selectedMainProduct.id;
      params.parent_name = this.selectedMainProduct.name;
    }

    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: params,
        queryParamsHandling: 'merge'
      });
  }

  search() {
    this.p = 1;
    this.setRoute();
    this.getProducts(this.selectedMainProduct, this.searchValue);
  }

  pagination(page) {
    this.p = page;
    this.setRoute();
    this.getProducts(this.selectedMainProduct, this.searchValue);
  }

  getProducts(product: any = null, search: any = null) {
    this.selectedMainProduct = product || null;
    this.spinner.show();
    this.productsService
      .getProducts({
        page: this.p ? this.p : 1,
        q: (search) ? search : '',
        sub_category_id: this.sub_category_id ? this.sub_category_id : '',
        parent_id: (product) ? product.id : ''
      })
      .subscribe((response: any) => {
        this.products = response.data.products;
        this.products = this.products.map((item) => {
          item.deactivated = !item.active;
          return item;
        });
        this.total = response.data.total;
        this.setDraftProducts();
        this.spinner.hide();
      });
  }

  setDraftProducts() {
    if (!this.selectedMainProduct) {
      const drafts = this.draftProductService.getDraftProducts();
      if (drafts.length) {
        drafts.forEach(item => {
          item.isDraft = true;
        });
        this.products.unshift(...drafts);
        this.total = this.total + drafts.length;
      }
    }
  }

  getProductSubCategory(data) {
    this.setRoute()
    this.p = 1;
    this.getProducts();
  }

  getProductsVariants(product) {
    if (this.selectedMainProduct) {
      this.viewProduct(product);
    } else {
      this.p = 1;
      this.filter = { q: '', page: 1 };
      this.searchValueProduct = this.searchValue;
      this.searchValue = '';
      this.selectedMainProduct = product;
      this.setRoute();
    }
  }

  backToProducts() {
    this.searchValue = this.searchValueProduct;
    this.selectedMainProduct = null;
    this.p = 1;
    this.filter = { q: '', page: 1 };
    this.setRoute();
  }

  goToLink() {
    const token = this.auth.getToken();
    const urlBasic = environment.api + '/admin/products/fullExport';
    const urlBasicWithsubCategory = environment.api + '/admin/products/fullExport?sub_category_id=' + this.sub_category_id;
    if (this.sub_category_id) {
      this.productsService.exportFileProducts(urlBasicWithsubCategory).subscribe({
        next: ((rep: any) => {
          if (rep.code === 200) {


          }
        })
      });
      setTimeout(() => {
        this.toastrService.success('You’ll receive a notification when the export is ready for download.', ' Your export is now being generated ', {
          enableHtml: true,
          timeOut: 3000
        });
      }, 500);
    } else {
      this.productsService.exportFileProducts(urlBasic).subscribe({
        next: ((rep: any) => {
          if (rep.code === 200) {

          }
        })
      });
      setTimeout(() => {
        this.toastrService.success('You’ll receive a notification when the export is ready for download.', ' Your export is now being generated ', {
          enableHtml: true,
          timeOut: 3000
        });
      }, 500);
    }
  }

  exportStocks() {
    const exportStock = environment.api + '/admin/products/exportStocks';

    this.productsService.exportFileStocks(exportStock).subscribe({
      next: ((rep: any) => {


      })
    });
    setTimeout(() => {
      this.toastrService.success('You’ll receive a notification when the export is ready for download.', ' Your export is now being generated ', {
        enableHtml: true,
        timeOut: 3000
      });
    }, 500);
  }

  changePage(p) {
    this.p = p;
    this.filter.page = p;
    // console.log(this.filter);
    this.filter$.next(this.filter);
  }

  searchProducts() {
    return this.productsService.searchProducts(this.filter, this.filter.page);
  }

  // images UpLoad
  ngOnChanges() {
    this.onimgeSelected(event);
  }

  onimgeSelected(event) {
    this.selectFile = <File>event.target.files[0];
    this.uploadFile.uploadFile(this.selectFile).subscribe((response: any) => {
      if (response.body) {
        this.product.image = response.body.data.name;
        this.product.imageUrl = response.body.data.filePath;
        this.showError = 0;
      }
    });
  }

  onimagesSelected(event, image) {
    this.selectImages = <File>event.target.files[0];
    this.uploadFile.uploadFile(this.selectImages).subscribe((response: any) => {
      if (response.body) {
        image.url = response.body.data.name;
        image.urlPath = response.body.data.filePath;
        this.showError = 0;
      }
    });
  }

  viewProduct(product) {
    console.log('viewProduct');
    this.currentProduct = product;

    // console.log(product);
    this.selectProductDataView = null;
    this.selectProductDataView = product;
    this.toggleAddProduct = 'out';
    this.viewProductSidebar = 'in';
  }

  toggleMenu(data) {
    // console.log('toggleMenu');
    this.selectProductData = { ...data };
    this.viewProductSidebar = 'out';
    this.toggleAddProduct = 'in';
  }

  toggleEditVariantMenu(data) {
    this.selectedProductVariantData = { ...data };
    this.viewProductSidebar = 'out';
    this.toggleVariant = 'in';
  }

  createNew() {
    if (this.selectedMainProduct) {
      this.toggleMenuNewVariant(null);
    } else {
      this.toggleMenuNew(null);
    }
  }

  NewProductWithVariant(data) {
    this.selectedProductVariantBoth = data;
    this.toggleProductVariant = 'in';
    this.viewProductSidebar = 'out';
    this.toggleVariant = 'out';
    this.toggleAddProduct = 'out';
  }

  edit(data) {
    if (this.selectedMainProduct) {
      if (!this.selectedMainProduct.product_variant_options){
        this.selectedMainProduct.product_variant_options = data.product_variant_options;
      }
      this.toggleEditVariantMenu(data);
    } else {
      this.toggleMenu(data);
    }
  }

  toggleMenuNew(data) {
    // console.log('toggleMenuNew');
    this.productForm.resetForm();
    this.selectProductData = null;
    this.selectProductData = data;
    this.viewProductSidebar = 'out';
    this.toggleAddProduct = 'in';
  }

  toggleMenuNewVariant(data) {
    this.selectedProductVariantData = null;
    this.selectedProductVariantData = data;
    this.viewProductSidebar = 'out';
    this.toggleVariant = 'in';
  }

  closeSideBar() {
    this.toggleAddProduct = 'out';
    this.toggleVariant = 'out';
    this.viewProductSidebar = 'out';
    this.toggleProductVariant = 'out';
  }

  addOrUpdateProduct(data) {
    const index = this.products.findIndex((item) => item.id == data.id);
    if (index !== -1) {
      this.products[index] = data;
    } else {
      this.products.unshift(data);
    }
  }

  getProductStats() {
    this.productsService
      .getStats(this.currentProduct.id, {
        begin: new Date(this.dateRange.begin),
        end: new Date(this.dateRange.end),
      })
      .subscribe((response: any) => {
        // this.lineChartLabels1 = response.data.map((item) => item.month);
        // this.lineChartData1 = [
        //   {
        //     data: response.data.map((item) => item.productAmount),
        //     label: this.currentProduct.name,
        //   },
        // ];
      });
  }

  onQuantityFieldsChange() {
    if (
      this.addProductForm.get('max_per_order').value ||
      this.addProductForm.get('min_days').value
    ) {
      this.addProductForm
        .get('max_per_order')
        .setValidators([Validators.required]);
      this.addProductForm.get('min_days').setValidators([Validators.required]);
    } else {
      this.addProductForm.get('max_per_order').clearValidators();
      this.addProductForm.get('min_days').clearValidators();
    }

    this.addProductForm.get('max_per_order').updateValueAndValidity();
    this.addProductForm.get('min_days').updateValueAndValidity();
  }

  addProducts(product) {
    product.option_values = this.product.option_values;
    // console.log(product);
    // console.log(this.product);
    if (!this.addProductForm.valid) {
      this.markFormGroupTouched(this.addProductForm);
      return;
    }

    if (!product.image) {
      this.showError = 1;
      return;
    }

    this.productsService.creatProduct(product).subscribe((response: any) => {
      if (response.code == 200) {
        // this.products.push(response.data)
        this.getProducts();
        $('#add-prod').toggleClass('open-view-vindor-types');
        this.addProductForm.reset();
      } else {
        this.toastrService.error(response.message);
      }
    });
  }

  editProduct(product) {
    this.product = JSON.parse(JSON.stringify(product));
    this.category_id = this.product.category.id;
    this.product.imageUrl = this.product.image;
    this.product.images.map((image) => (image.urlPath = image.url));
    this.product.deleted_images = [];
    this.selectCategory(this.category_id);
    this.selectSubCategoryOption(this.product.options[0]);
    $('#edit-prod').toggleClass('open-view-vindor-types');
  }

  updateProduct(product) {
    product.option_values = this.product.option_values;
    // console.log(product);
    this.productsService
      .updateProduct(product.id, product)
      .subscribe((response: any) => {
        if (response.code == 200) {
          const ind = this.products.findIndex((item) => item.id == product.id);

          if (ind !== -1) {
            this.products[ind] = response.data;
          }

          $('#edit-prod').toggleClass('open-view-vindor-types');
        } else {
          this.toastrService.error(response.message);
        }
      });
  }

  importExcel(event) {
    this.selectFile = <File>event.target.files[0];
    this.productsService
      .uploadFile(this.selectFile)
      .subscribe((response: any) => {
        // if (response.body) {
        //   this.product.image = response.body.data.name;
        //   this.product.imageUrl = response.body.data.filePath;
        //   this.showError = 0;
        // }
      });
    setTimeout(() => {
      this.toastrService.success('You’ll receive a notification when the import is done', 'Your import is now being generated.', {
        enableHtml: true,
        timeOut: 3000
      });
    }, 500);
    this.importFile.nativeElement.value = '';
  }

  importStock(event) {
    this.selectFile = <File>event.target.files[0];

    this.productsService
      .uploadFileStock(this.selectFile)
      .subscribe((response: any) => {
        if (response.code === 200) {

        }
        // if (response.body) {
        //   this.product.image = response.body.data.name;
        //   this.product.imageUrl = response.body.data.filePath;
        //   this.showError = 0;
        // }
      });
    setTimeout(() => {
      this.toastrService.success('You’ll receive a notification when the import is done.', 'Your import is now being generated', {
        enableHtml: true,
        timeOut: 3000
      });
    }, 500);
    this.importFileStock.nativeElement.value = '';

  }

  getCategories() {
    this._CategoriesService.getCategories().subscribe((response: any) => {
      // console.log(response.data);
      this.categories = response.data;
      if (this.route.snapshot.queryParams.sub_category_id) {
        this.selectCategoryFilter(this.main_category, true);
        this.sub_category_id = this.route.snapshot.queryParams.sub_category_id;
      }
    });
  }

  selectCategory(cat_id) {
    const index = this.categories.findIndex((item) => item.id == cat_id);

    const category = this.categories[index];

    this.sub_categories = category.sub_categories;
    // console.log(this.sub_categories);
  }

  selectCategoryFilter(cat_id, FromRouter) {
    if (cat_id) {
      const index = this.categories.findIndex((item) => item.id == cat_id);
      const category = this.categories[index];
      this.sub_categories = category.sub_categories;
      if (FromRouter) {
        this.sub_category_id = this.route.snapshot.queryParams.sub_category_id;
      } else {
        this.sub_category_id = '';
      }
    } else {
      this.sub_categories = [];
      this.sub_category_id = ''
    }
    this.setRoute();
  }

  selectSubCategoryOption(cat_id) {
    // console.log(cat_id);
    // console.log(this.sub_categories);
    const index = this.sub_categories.findIndex(
      (item) => item.parent_id == cat_id
    );
    // console.log(index);

    this.options = this.sub_categories[index].options;
    // console.log(this.options);
  }

  selectOptionValue(option, value, index) {
    // console.log(option, value, index);
    if (this.product.option_values) {
      const indexOption = this.product.option_values.findIndex(
        (item) => item.option_id == option.id
      );
      if (indexOption !== -1) {
        this.product.option_values[indexOption].option_value_id =
          value.target.value;
      } else {
        this.product.option_values.push({
          option_id: option.id,
          option_value_id: value.target.value,
        });
      }
    } else {
      this.product.option_values.push({
        option_id: option.id,
        option_value_id: value.target.value,
      });
    }
  }

  addImage(product) {
    if (product.images.length < 4) {
      product.images.push({
        url: '',
        urlPath: '',
      });
    }
  }

  removeImage(product, index) {
    if (product.id) {
      product.deleted_images.push(product.images[index].id);
    }

    product.images.splice(index, 1);
  }

  changeActive(product) {
    this.products
      .filter((product) => {
        return product.showReason;
      })
      .map((product) => {
        if (product.active == product.deactivated) {
          product.active = !product.active;
        }
        product.showReason = 0;
        return product;
      });

    if (product.active) {
      // currently checked
      product.showReason = 0;
      product.notes = '';
      if (product.deactivated) {
        this.productsService
          .activateProduct(product.id)
          .subscribe((data: any) => {
            product.active = 1;
            product.notes = '';
            product.deactivation_notes = '';
            product.deactivated = 0;
          });
      }
    } else {
      product.notes = product.deactivation_notes;
      product.showReason = 1;
    }
  }

  cancelDeactivate(product) {
    product.active = 1;
    product.notes = '';
    product.showReason = 0;
  }

  submitDeactivate(product) {
    product.active = 0;
    this.productsService
      .deactivateProduct(product.id, { deactivation_notes: product.notes })
      .subscribe((data: any) => {
        product.active = 0;
        product.deactivation_notes = product.notes;
        product.showReason = 0;
        product.deactivated = 1;
      });
  }

  resetForm() {
    this.addProductForm.reset();
    this.product.images = [];
    this.product.image = '';
    this.product.imageUrl = '';
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  clone(product) {
    this.currentProduct = product;
    $("#cloneProduct").modal("show");
  }

  confirmClone() {
    this.stateCloning = true;
    this.productsService.clone(this.currentProduct.id)
      .subscribe((response: any) => {
        if (response.code == 200) {
          this.stateCloning = false;
          this.toastrService.success("Product Clone Successfully", 'Success', {
            enableHtml: true,
            timeOut: 3000
          });
          this.addOrUpdateProduct(response.data);
          $("#cloneProduct").modal("hide");
          /*this.filter$.next(this.filter);*/
        } else {
          this.stateCloning = false;
          this.toastrService.error(response.message, 'Error Occured', {
            enableHtml: true,
            timeOut: 3000
          });
        }
      });
  }

  removeDraftProduct(product, idx) {
    this.draftProductService.clearDraftProduct(product);
    this.products.splice(idx, 1);
    this.toasterService.success('Draft Product Removed Successfully');
  }

  editDraftProduct(product) {
    this.NewProductWithVariant({...product});
  }

  cloneDraft(product) {
    const data = {...product};
    delete data.id;
    const clonedProduct = this.draftProductService.SetDraftProduct(data);
    this.addOrUpdateProduct(clonedProduct);
    this.toasterService.success('Draft Product Cloned Successfully');
  }
}
