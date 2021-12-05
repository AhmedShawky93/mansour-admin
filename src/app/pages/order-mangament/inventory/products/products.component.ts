import "rxjs/add/operator/take";
import "rxjs/Rx";

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { DOCUMENT } from "@angular/common";
import {
  Component,
  ElementRef,
  Inject,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  ActivatedRoute,
  Router,
} from "@angular/router";

import { environment } from "environments/environment.prod";
import { debounce } from "lodash";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { tap } from "rxjs/operators";
import { Subject } from "rxjs/Rx";

import { CategoryService } from "@app/pages/services/category.service";
import { DraftProductService } from "@app/pages/services/draft-product.service";
import { ProductsService } from "@app/pages/services/products.service";
import {
  ShowAffiliateService,
} from "@app/pages/services/show-affiliate.service";
import { UploadFilesService } from "@app/pages/services/upload-files.service";
import { AuthService } from "@app/shared/auth.service";

import { SettingService } from "../../../services/setting.service";
import {
  AddEditProductComponent,
} from "./add-edit-product/add-edit-product.component";

declare var $: any;

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          transform: "translate3d(0px, 0, 0)",
          background: "#000000cf",
          width: "100%",
        })
      ),
      state(
        "out",
        style({
          transform: "translate3d(-100%, 0, 0)",
          background: "#000000cf",
          width: "100%",
        })
      ),
      transition("in => out", animate("300ms ease-in-out")),
      transition("out => in", animate("300ms ease-in-out")),
    ]),
  ],
})
export class ProductsComponent implements OnInit, OnChanges, OnDestroy {
  filterForm: FormGroup = new FormGroup({});
  addProductForm: FormGroup;

  @ViewChild("myInput") importFile: ElementRef;
  @ViewChild("myInputStock") importFileStock: ElementRef;
  @ViewChild("productForm") productForm: AddEditProductComponent;

  fileName: any;
  dateRange: any;
  showError: number;
  currentProduct: any;
  category_id: any;
  selectedDraft: any;
  // syncFbSheet: any;
  selectedUserIds: number[];
  products: Array<any> = [];
  selectedMainProduct: any;
  public product: any = {
    name: "",
    description: "",
    brand_id: "",
    price: "",
    discount_price: "",
    sku: "",
    category_id: "",
    image: "",
    long_description_ar: "",
    long_description_en: "",
    option_values: ([] = []),
    images: [],
  };

  toggleAddProduct = "out";
  viewProductSidebar = "out";
  toggleVariant: string;
  toggleProductVariant: string;
  viewVariantSidebar: string;
  selectProductData: any;
  selectProductDataView: any;
  selectedProductVariantData: any;
  selectedProductVariantBoth: any;
  categories: any;
  sub_categories: any = [];
  options: any[];
  selectFile = null;
  selectImages = null;
  total = 0;
  page = 1;
  exportUrl: string;
  exportStock: string;
  formProduct;
  brands = [];
  newPrdouct;
  updateProductForm;
  filter$ = new Subject();
  loading: boolean;
  filter = {
    q: "",
    page: 1,
  };
  website_url: any;
  isAffiliate: any;
  historyRoute: any;
  stateCloning: boolean;
  statedeleting: boolean;
  environmentVariables: any;
  parent_id: any = "";
  brandsarray: any[];
  categoriesarray: any[];

  constructor(
    private productsService: ProductsService,
    private uploadFile: UploadFilesService,
    private _CategoriesService: CategoryService,
    private auth: AuthService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private showAffiliateService: ShowAffiliateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService,
    private draftProductService: DraftProductService,
    private settingService: SettingService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.search = debounce(this.search, 700);
    this.toggleVariant = "out";
    this.toggleProductVariant = "out";
    this.viewVariantSidebar = "out";

    this.getCategoriesList();
  }

  getConfig() {
    this.settingService.getenvConfig().subscribe((res) => {
      this.environmentVariables = res;
    });
    this.website_url = this.environmentVariables.envApi.env.checkoutUrl;
  }

  addCustomUser = (term) => ({ id: term, name: term });

  ngOnInit() {
    this.initProductFilterForm();
    this.getConfig();
    // this.syncFbSheet = `${environment.api}/api/admin/products/export_fb`;
    this.productsService
      .getBrands()
      .subscribe((response: any) => (this.brands = response.data));

    this.filter$
      .debounceTime(400)
      .pipe(tap(() => (this.loading = true)))
      .switchMap(() => this.searchProducts())
      .subscribe((result: any) => {
        this.products = result.data.products;
        this.products = this.products.map((item) => {
          item.deactivated = !item.active;
          return item;
        });
        this.total = result.data.total;
      });
    this.getProducts();
    // this.setNavigateParams();

    // this.activatedRoute.queryParams.subscribe(() => {
    //   this.getProducts();
    // });

    $(".add-product").on("click", function () {
      $("#add-prod").toggleClass("open-view-vindor-types");
    });

    $(".edit-product").on("click", function () {
      $("#edit-prod").toggleClass("open-view-vindor-types");
    });

    $(".open-show").on("click", function () {
      $("#show-p-details").toggleClass("open-view-vindor-types");
    });

    $(".slider").on("click", function () {
      const then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });

    $("#close-vindors1").on("click", function () {
      $("#add-prod").removeClass("open-view-vindor-types");
    });

    $("#close-vindors2").on("click", function () {
      $("#edit-prod").removeClass("open-view-vindor-types");
    });

    $("#show-p-details").on("click", "#close-vindors4", function () {
      $("#show-p-details").removeClass("open-view-vindor-types");
    });

    const token = this.auth.getToken();
    this.exportUrl = `${
      environment.api
    }/api/admin/products/fullExport?token=${token}&${
      this.getFormControlValue("sub_category_id") &&
      "sub_category_id=" + this.getFormControlValue("sub_category_id")
    }`;
    this.exportStock = `${environment.api}/api/admin/products/export_prices?token=${token}`;
  }

  ngOnChanges() {
    this.onimgeSelected(event);
  }

  ngOnDestroy() {
    document.body.style.overflow = "auto";
  }

  getFormControlValue(formControlValue) {
    return this.filterForm.get(formControlValue).value;
  }
  exportFb() {
    this.productsService.exportFbSheet().subscribe((res) => {
      this.toastrService.success(
        "You’ll receive a notification when the export is ready for download.",
        " Your export is now being generated ",
        {
          enableHtml: true,
          timeOut: 3000,
        }
      );
    });
  }
  setNavigateParams() {
    this.router.navigate(["/pages/products"], {
      relativeTo: this.activatedRoute,
      queryParams: {
        category_id: this.getFormControlValue("category_id"),
        page: this.page,
        sub_category_id: this.getFormControlValue("sub_category_id"),
        q: this.getFormControlValue("searchValue"),
        parent_id: "",
        parent_name: "",
      },
      queryParamsHandling: "merge",
    });
  }

  initProductFilterForm() {
    this.filterForm = new FormGroup({
      searchValue: new FormControl(""),
      category_id: new FormControl(""),
      sub_category_id: new FormControl(""),
    });
  }

  getAffiliate() {
    this.showAffiliateService.showAffiliate.subscribe((rep: any) => {
      console.log("#### rep ==>", rep);
      this.isAffiliate = rep;
    });
  }

  search() {
    this.page = 1;
    this.getProducts(this.parent_id);
  }

  pagination(page) {
    this.page = page;
    this.getProducts();
  }

  getProducts(id = "") {
    this.parent_id = id;
    this.spinner.show();
    let data = {
      page: this.page,
      q: this.getFormControlValue("searchValue"),
      category_id: this.getFormControlValue("category_id"),
      sub_category_id: this.getFormControlValue("sub_category_id"),
      parent_id: id,
    };

    this.productsService.getProducts(data).subscribe((response: any) => {
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
        drafts.forEach((item) => {
          item.isDraft = true;
        });
        this.products.unshift(...drafts);
        this.total = this.total + drafts.length;
      }
    }
  }

  getProductVariants(product) {
    this.closeSideBar();
    if (this.selectedMainProduct) {
      this.viewProduct(product);
    } else {
      this.page = 1;
      this.filter = { q: "", page: 1 };
      this.filterForm.get("searchValue").setValue("");
      this.selectedMainProduct = product;
      this.getProducts(product?.id);
    }
  }

  backToProducts() {
    this.selectedMainProduct = null;
    this.page = 1;
    this.filterForm.get("searchValue").setValue("");
    this.filterForm.get("category_id").setValue("");
    this.filterForm.get("sub_category_id").setValue("");
    this.parent_id = "";
    this.getProducts();
  }

  goToLink() {
    const fullExportApiUrl = `${environment.api}/api/admin/products/fullExport`;
    const fullExportWithSubCategoriesApiUrl = `${
      environment.api
    }/api/admin/products/fullExport?sub_category_id=${this.getFormControlValue(
      "sub_category_id"
    )}`;

    this.productsService
      .exportFile(
        this.getFormControlValue("sub_category_id")
          ? fullExportWithSubCategoriesApiUrl
          : fullExportApiUrl
      )
      .subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.toastrService.success(
              "You’ll receive a notification when the export is ready for download.",
              " Your export is now being generated ",
              {
                enableHtml: true,
                timeOut: 3000,
              }
            );
          }
        },
        () => {
          this.toastrService.error(
            "Network Error.",
            " Please check your network connection",
            {
              enableHtml: true,
              timeOut: 3000,
            }
          );
        }
      );
  }

  exportStocks() {
    const exportStock = `${environment.api}/api/admin/products/exportStocks`;

    this.productsService.exportFile(exportStock).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.toastrService.success(
            "You’ll receive a notification when the export is ready for download.",
            " Your export is now being generated ",
            {
              enableHtml: true,
              timeOut: 3000,
            }
          );
        }
      },
      () => {
        this.toastrService.error(
          "Network Error.",
          " Please check your network connection",
          {
            enableHtml: true,
            timeOut: 3000,
          }
        );
      }
    );
  }

  changePage(p) {
    this.page = p;
    this.filter.page = p;
    this.filter$.next(this.filter);
  }

  searchProducts() {
    return this.productsService.searchProducts(this.filter, this.filter.page);
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

  viewProduct(product) {
    this.currentProduct = product;
    this.selectProductDataView = null;
    this.selectProductDataView = product;
    this.toggleAddProduct = "out";
    this.viewProductSidebar = "in";
  }

  toggleMenu(data) {
    this.selectProductData = { ...data };
    this.viewProductSidebar = "out";
    this.toggleAddProduct = "in";
    this.brandsarray = this.brands;
    this.categoriesarray = this.categories;
  }

  toggleEditVariantMenu(data) {
    this.selectedProductVariantData = { ...data };
    this.viewProductSidebar = "out";
    this.toggleVariant = "in";
  }

  createNew() {
    if (this.selectedMainProduct) {
      this.toggleMenuNewVariant(null);
    } else {
      this.toggleMenuNew(null);
    }
    this.disableBodyScrollTop();
  }

  NewProductWithVariant(data?) {
    this.selectedProductVariantBoth = data;
    this.toggleProductVariant = "in";
    this.viewProductSidebar = "out";
    this.toggleVariant = "out";
    this.toggleAddProduct = "out";
    this.disableBodyScrollTop();
    this.brandsarray = this.brands;
    this.categoriesarray = this.categories;
  }

  edit(data) {
    this.closeSideBar();
    if (this.selectedMainProduct) {
      if (!this.selectedMainProduct.product_variant_options) {
        this.selectedMainProduct.product_variant_options =
          data.product_variant_options;
      }
      this.toggleEditVariantMenu(data);
    } else {
      this.toggleMenu(data);
    }
    this.disableBodyScrollTop();
  }

  disableBodyScrollTop() {
    window.scroll(0, 0);
    document.body.style.overflow = "hidden";
    document.getElementById("add-prod").scroll(0, 0);
  }

  removeProduct(product) {
    this.currentProduct = product;
    $("#deleteProduct").modal("show");
  }

  toggleMenuNew(data) {
    this.productForm.resetForm();
    this.selectProductData = null;
    this.selectProductData = data;
    this.viewProductSidebar = "out";
    this.toggleAddProduct = "in";
  }

  toggleMenuNewVariant(data) {
    this.selectedProductVariantData = null;
    this.selectedProductVariantData = data;
    this.viewProductSidebar = "out";
    this.toggleVariant = "in";
  }

  closeSideBar() {
    this.toggleAddProduct = "out";
    this.toggleVariant = "out";
    this.viewProductSidebar = "out";
    this.toggleProductVariant = "out";
    document.body.style.overflow = "auto";
  }

  addOrUpdateProduct(data) {
    const index = this.products.findIndex((item) => item.id == data.id);
    if (index !== -1 && !data["delete"]) {
      this.products[index] = data;
    } else if (index !== -1 && data["delete"]) {
      this.products.splice(index, 1);
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
      .subscribe();
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

  addProducts(product) {
    product.option_values = this.product.option_values;
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
        this.getProducts();
        $("#add-prod").toggleClass("open-view-vindor-types");
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
    $("#edit-prod").toggleClass("open-view-vindor-types");
  }

  updateProduct(product) {
    product.option_values = this.product.option_values;
    this.productsService
      .updateProduct(product.id, product)
      .subscribe((response: any) => {
        if (response.code == 200) {
          const ind = this.products.findIndex((item) => item.id == product.id);

          if (ind !== -1) {
            this.products[ind] = response.data;
          }

          $("#edit-prod").toggleClass("open-view-vindor-types");
        } else {
          this.toastrService.error(response.message);
        }
      });
  }

  importExcel(event) {
    this.selectFile = <File>event.target.files[0];
    this.productsService
      .import(this.selectFile, "2")
      .subscribe((response: any) => {
        if (response.code == 200) {
          this.toastrService.success("File uploaded successfully");
        } else {
          this.toastrService.error(response.message);
        }
      });
  }

  importStock(event) {
    this.selectFile = <File>event.target.files[0];
    this.productsService.import(this.selectFile, "6").subscribe((res: any) => {
      res.code == 200
        ? this.toastrService.success("File uploaded successfully")
        : this.toastrService.error(res.message);
    });
  }

  getCategoriesList() {
    this._CategoriesService
      .getCategories()
      .subscribe((response: any) => (this.categories = response.data));
  }

  selectCategory(cat_id) {
    const index = this.categories.findIndex((item) => item.id == cat_id);
    const category = this.categories[index];
    this.sub_categories = category.sub_categories;
  }

  selectCategoryFilter() {
    const categoryId = this.getFormControlValue("category_id");
    if (categoryId && this.categories) {
      let categorySelected = this.categories.find(
        (category) => category.id == categoryId
      );
      this.sub_categories = categorySelected.sub_categories;

      console.log(categoryId, categorySelected);
      this.getProducts();
    }
    // this.setNavigateParams();
  }

  resetFilterForm() {
    this.filterForm.get("searchValue").setValue("");
    this.filterForm.get("category_id").setValue("");
    this.filterForm.get("sub_category_id").setValue("");
    this.filterForm.get("searchValue").updateValueAndValidity();
    this.filterForm.get("category_id").updateValueAndValidity();
    this.filterForm.get("sub_category_id").updateValueAndValidity();
    this.page = 1;
    this.getProducts();
  }

  selectSubCategoryOption(cat_id) {
    const index = this.sub_categories.findIndex(
      (item) => item.parent_id == cat_id
    );

    this.options = this.sub_categories[index].options;
  }

  selectOptionValue(option, value, index) {
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
        url: "",
        urlPath: "",
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
      product.showReason = 0;
      product.notes = "";
      if (product.deactivated) {
        this.productsService
          .activateProduct(product.id)
          .subscribe((data: any) => {
            product.active = 1;
            product.notes = "";
            product.deactivation_notes = "";
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
    product.notes = "";
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
    this.product.image = "";
    this.product.imageUrl = "";
  }

  clone(product) {
    this.currentProduct = product;
    $("#cloneProduct").modal("show");
  }

  confirmClone() {
    if (this.stateCloning) {
      return;
    }
    this.productsService
      .clone(this.currentProduct.id)
      .subscribe((response: any) => {
        if (response.code == 200) {
          this.stateCloning = false;
          this.toastrService.success("Product Clone Successfully", "Success", {
            enableHtml: true,
            timeOut: 3000,
          });
          this.addOrUpdateProduct(response.data);
          $("#cloneProduct").modal("hide");
          /*this.filter$.next(this.filter);*/
        } else {
          this.stateCloning = false;
          this.toastrService.error(response.message, "Error Occured", {
            enableHtml: true,
            timeOut: 3000,
          });
        }
      });
    this.stateCloning = true;
  }

  encodedProductName(name) {
    return name
      .replace(/\s/g, "-")
      .replace("/", "-")
      .replace("(", "-")
      .replace(")", "-");
  }

  confirmDelete() {
    this.statedeleting = true;
    this.productsService
      .softDeleteProduct(this.currentProduct.id)
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.statedeleting = false;
          this.toastrService.success(
            "Product deleted Successfully",
            "Success",
            {
              enableHtml: true,
              timeOut: 3000,
            }
          );
          this.currentProduct["delete"] = true;
          this.addOrUpdateProduct(this.currentProduct);
          $("#deleteProduct").modal("hide");
        } else {
          this.statedeleting = false;
          this.toastrService.error(response.message, "Error Occured", {
            enableHtml: true,
            timeOut: 3000,
          });
        }
      });
  }

  removeDraftConfirmation(product, idx) {
    if (!this.selectedMainProduct) {
      this.selectedDraft = { product: product, index: idx };
      $("#deleteDraft").modal("show");
    }
  }

  removeDraftProduct() {
    this.draftProductService.clearDraftProduct(this.selectedDraft.product);
    this.products.splice(this.selectedDraft.index, 1);
    $("#deleteDraft").modal("hide");
    this.toasterService.success("Draft Product Removed Successfully");
  }

  editDraftProduct(product) {
    this.NewProductWithVariant({ ...product });
  }

  cloneDraft(product) {
    const data = { ...product };
    delete data.id;
    const clonedProduct = this.draftProductService.SetDraftProduct(data);
    this.addOrUpdateProduct(clonedProduct);
    this.toasterService.success("Draft Product Cloned Successfully");
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
