import { Component, OnInit } from "@angular/core";
import { ProductsService } from "@app/pages/services/products.service";
import { CategoryService } from "@app/pages/services/category.service";
import "rxjs/add/operator/take";
import { UploadFilesService } from "@app/pages/services/upload-files.service";
import { environment } from "@env/environment";
import { AuthService } from "@app/shared/auth.service";
import { products } from "@app/products";
import { ToastrService } from "ngx-toastr";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  NgForm,
} from "@angular/forms";
import { ViewChild } from "@angular/core";
import { ElementRef } from "@angular/core";
declare var jquery: any;
declare var $: any;
import "rxjs/Rx";
import { Subject } from "rxjs/Rx";
import { tap, delay } from "rxjs/operators";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  searchForm: FormGroup;
  dateRange: any;
  showError: number;
  currentProduct: any;
  category_id: any;
  @ViewChild("myInput") importFile: ElementRef;

  selectedUserIds: number[];
  products = [];
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
    option_values: [] = [],
    images: [],
  };
  addProductForm: FormGroup;
  addCustomUser = (term) => ({ id: term, name: term });

  categories: any;

  sub_categories: any[];
  options: any[];
  selectFile = null;
  selectImages = null;

  total = 0;
  p = 1;

  exportUrl: string;
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

  constructor(
    private productsService: ProductsService,
    private uploadFile: UploadFilesService,
    private _CategoriesService: CategoryService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getCategories();
    this.getProducts();
    this.productsService.getBrands().subscribe((response: any) => {
      this.brands = response.data;
    });

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(),
    });

    // this.searchForm.get('searchTerm').valueChanges
    //       .debounceTime(800)
    //       .distinctUntilChanged()
    //       // .filter(term => term && term.trim().length > 0)
    //       .switchMap(term => {
    //         if (term && term.trim().length > 0) {
    //           return this.productsService.searchProducts(term)
    //         } else {
    //           return this.productsService.getProducts(this.p);
    //         }
    //       })
    //       .subscribe((result: any) => {
    //           this.products = result.data.products;
    //           this.products = this.products.map(item => {
    //             item.deactivated = !item.active;
    //             return item;
    //           })
    //           this.total = result.data.total;
    //       });

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
      var then = $(this).siblings(".reason-popup").slideToggle(100);
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

    let token = this.auth.getToken();

    this.exportUrl = environment.api + "/admin/products/export?token=" + token;

    this.addProductForm = new FormGroup({
      name: new FormControl("", Validators.required),
      name_ar: new FormControl("", Validators.required),
      description: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(250),
      ]),
      long_description_en: new FormControl("", []),
      long_description_ar: new FormControl("", []),
      description_ar: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(250),
      ]),
      price: new FormControl("", Validators.required),
      discount_price: new FormControl("", [
        Validators.max(this.product.price),
        Validators.min(1),
      ]),
      brand_id: new FormControl("", Validators.required),
      main_category: new FormControl("", Validators.required),
      category_id: new FormControl("", Validators.required),
      sku: new FormControl("", Validators.required),
      image: new FormControl("", Validators.required),
      max_per_order: new FormControl(),
      min_days: new FormControl(),
      option_values: new FormControl([]),
    });
  }

  getProducts() {
    this.productsService
      .getProducts(this.p)
      .pipe(delay(1000))
      .subscribe((response: any) => {
        this.products = response.data.products;
        this.products = this.products.map((item) => {
          item.deactivated = !item.active;
          return item;
        });
        this.total = response.data.total;
      });
  }

  changePage(p) {
    this.p = p;
    this.filter.page = p;
    console.log(this.filter);
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
    this.currentProduct = product;
    // set chart data

    $("#show-p-details").toggleClass("open-view-vindor-types");
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
    console.log(product);
    console.log(this.product);
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
    console.log(product);
    this.productsService
      .updateProduct(product.id, product)
      .subscribe((response: any) => {
        if (response.code == 200) {
          let ind = this.products.findIndex((item) => item.id == product.id);

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
      .uploadFile(this.selectFile)
      .subscribe((response: any) => {
        // if (response.body) {
        //   this.product.image = response.body.data.name;
        //   this.product.imageUrl = response.body.data.filePath;
        //   this.showError = 0;
        // }
      });

    this.toastrService.success("File uploaded successfully");
    this.importFile.nativeElement.value = "";
  }

  getCategories() {
    this._CategoriesService.getCategories().subscribe((response: any) => {
      this.categories = response.data;
    });
  }

  selectCategory(cat_id) {
    let index = this.categories.findIndex((item) => item.id == cat_id);

    let category = this.categories[index];

    this.sub_categories = category.sub_categories;
    console.log(this.sub_categories);
  }
  selectSubCategoryOption(cat_id) {
    console.log(cat_id);
    console.log(this.sub_categories);
    let index = this.sub_categories.findIndex(
      (item) => item.parent_id == cat_id
    );
    console.log(index);

    this.options = this.sub_categories[index].options;
    console.log(this.options);
  }
  selectOptionValue(option, value, index) {
    console.log(option, value, index);
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
    debugger;
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

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  resetForm() {
    this.addProductForm.reset();
    this.product.images = [];
    this.product.image = "";
    this.product.imageUrl = "";
  }
}
