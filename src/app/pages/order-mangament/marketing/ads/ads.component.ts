import { Component, OnInit } from "@angular/core";
import { AdsService } from "@app/pages/services/ads.service";
import { UploadFilesService } from "@app/pages/services/upload-files.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  NgForm,
  ValidationErrors,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CategoryService } from "@app/pages/services/category.service";
import { BrandsService } from "@app/pages/services/brands.service";
import { ListsService } from "@app/pages/services/lists.service";
import { Observable, Subject, concat, of, EMPTY } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
  map,
  delay,
} from "rxjs/operators";
import { ProductsService } from "@app/pages/services/products.service";
import { ThrowStmt } from "@angular/compiler";
import { NgxSpinnerService } from "ngx-spinner";

declare var jquery: any;
declare var $: any;
@Component({
  selector: "app-ads",
  templateUrl: "./ads.component.html",
  styleUrls: ["./ads.component.css"],
})
export class adsComponent implements OnInit {
  category_id: any;
  editFormGroup: FormGroup;
  public productList: any[];
  brands = [];
  p = 1;
  total;
  orderArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  products: any = [];
  products$: Observable<any>;
  productsInput$ = new Subject<String>();
  productsLoading: boolean;

  categories: any;
  adCrrentEdit: any = [];
  id;
  product;
  adView;
  sub_categories: any[];

  category;

  ads = [];

  ad: any = {
    type: "",
    image: "",
    image_ar: "",
    item_id: "",
  };

  selectFile = null;

  newAdsForm: FormGroup;

  selectedSubcategory: any;

  selectedProductId: any;
  brand_id: any;
  currentAd: any;
  lists: any = [];
  showAddEditAd: boolean;
  showViewAd: boolean;
  submitting: boolean;

  constructor(
    private adsService: AdsService,
    private uploadFile: UploadFilesService,
    private toastrService: ToastrService,
    private _CategoriesService: CategoryService,
    private brandsService: BrandsService,
    private listsService: ListsService,
    private productsService: ProductsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    $(".switch").on("click", ".slider", function () {
      const then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });

    this.getAds();
    this.getCategories();
    this.getBrands();
    this.getLists();
    this.createForm();

    this.ad.popup = "";
  }

  createForm() {
    this.newAdsForm = new FormGroup({
      id: new FormControl(),
      type: new FormControl(10),
      popup: new FormControl(0),
      order: new FormControl("", Validators.required),
      banner_ad: new FormControl(0),
      banner_title: new FormControl(""),
      banner_title_ar: new FormControl(""),
      banner_description: new FormControl(""),
      banner_description_ar: new FormControl(""),
      category: new FormControl(""),
      subCategory: new FormControl(""),
      list_id: new FormControl(""),
      link: new FormControl(""),
      prod: new FormControl(""),
      image: new FormControl("", Validators.required),
      image_ar: new FormControl("", Validators.required),
      brand: new FormControl(),
      image_web: new FormControl("", Validators.required),
      image_web_ar: new FormControl("", Validators.required),
    });

    this.products$ = concat(
      of([]), // default items
      this.productsInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.productsLoading = true)),
        switchMap((term) =>
          this.productsService
            .searchProducts(
              {
                q: term,
                sub_category_id: this.newAdsForm.controls.subCategory.value,
                variant: 1,
              },
              1
            )
            .pipe(
              catchError(() => of([])), // empty list on error
              tap(() => (this.productsLoading = false)),
              map((response: any) => {
                this.productList = response.data.products;
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
  }

  getAds() {
    this.spinner.show();
    this.adsService.getAds().subscribe((response: any) => {
      this.spinner.hide();
      this.ads = response.data;
      this.ads = this.ads.map((item) => {
        item.deactivated = !item.active;
        return item;
      });
      this.total = this.ads.length;
    });
  }

  getLists() {
    this.listsService.getLists({}).subscribe((response: any) => {
      this.lists = response.data;
    });
  }

  onFormSubmit(form: FormGroup) {
    if (form.get("id").value) {
      this.updateAd();
    } else {
      this.createAd();
    }
  }

  editAd(ad) {
    this.showAddEditAd = true;
    if (ad.type == 1) {
      ad.item_id = ad.product_id;
    } else if (ad.type == 2) {
      ad.item_id = ad.sub_category_id;
    } else if (ad.type == 4) {
      /*ad.item_id = this.newAdsForm.get("brand").value;*/
    } else if (ad.type == 5) {
      ad.item_id = ad.custom_list_id;
    } else if (ad.type == 6) {
      ad.item_id = ad.category_id;
    }
    this.newAdsForm = new FormGroup({
      id: new FormControl(ad.id),
      type: new FormControl(ad.type),
      popup: new FormControl(0),
      order: new FormControl(ad.order, Validators.required),
      banner_ad: new FormControl(0),
      link: new FormControl(ad.link),
      banner_title: new FormControl(ad.banner_title),
      banner_title_ar: new FormControl(ad.banner_title_ar),
      banner_description: new FormControl(ad.banner_description),
      banner_description_ar: new FormControl(ad.banner_description_ar),
      image: new FormControl(ad.image, Validators.required),
      image_ar: new FormControl(
        ad.image_ar ? ad.image_ar : "",
        Validators.required
      ),
      image_web: new FormControl(ad.image_web, Validators.required),
      image_web_ar: new FormControl(
        ad.image_ar ? ad.image_web_ar : "",
        Validators.required
      ),
      /*prod: new FormControl(ad.type == 1 ? ad.item_id : ad.product_id),*/
      prod: new FormControl(ad.product_id),
      subCategory: new FormControl(
        ad.type == 2 ? ad.item_id : ad.sub_category_id
      ),
      brand: new FormControl(ad.type == 4 ? ad.item_id : ad.item_id),
      list_id: new FormControl(ad.type == 5 ? ad.item_id : ad.custom_list_id),
      category: new FormControl(ad.type == 6 ? ad.item_id : ad.category_id),
    });

    if (ad.type === 1) {
      this.products = [{ name: ad.name, id: ad.product_id }];
      this.productsService
        .searchProducts(
          { q: ad.name, sub_category_id: ad.sub_category_id, variant: 1 },
          1
        )
        .subscribe((res: any) => (this.productList = res.data.products));
      this.products$ = concat(
        of(this.products), // default items
        this.productsInput$.pipe(
          debounceTime(200),
          distinctUntilChanged(),
          tap(() => (this.productsLoading = true)),
          switchMap((term) =>
            this.productsService
              .searchProducts(
                { q: term, sub_category_id: ad.sub_category_id, variant: 1 },
                1
              )
              .pipe(
                catchError(() => of([])), // empty list on error
                tap(() => (this.productsLoading = false)),
                map((response: any) => {
                  this.productList = response.data.products;
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
    }

    this.adCrrentEdit = JSON.parse(JSON.stringify(ad));
    this.adCrrentEdit.imageUrl = this.adCrrentEdit.image;

    this.category_id = this.adCrrentEdit.category_id;
    this.selectedSubcategory = this.adCrrentEdit.sub_category_id;
    this.selectedProductId = this.adCrrentEdit.product_id;

    // fill select options
    if (this.adCrrentEdit.type == 1 || this.adCrrentEdit.type == 2) {
      this.onCategoryChange(this.category_id, true);

      // if (this.adCrrentEdit.type == 1) {
      //   this.onSubCategoryChange(this.selectedSubcategory, true);
      // }
    }

    this.onAdTypeChanged(this.newAdsForm, true);
  }

  onAdTypeChanged(form: FormGroup, firstTime = null) {
    if (form.get("type").value == 1) {
      form.get("category").setValidators([Validators.required]);
      form.get("subCategory").setValidators([Validators.required]);
      form.get("prod").setValidators([Validators.required]);
      form.get("link").clearValidators();
      form.get("brand").clearValidators();
      form.get("list_id").clearValidators();
      if (!firstTime) {
        form.get("category").setValue("");
        form.get("subCategory").setValue("");
        form.get("prod").setValue("");
      }
    } else if (form.get("type").value == 2) {
      form.get("category").setValidators([Validators.required]);
      form.get("subCategory").setValidators([Validators.required]);
      form.get("link").clearValidators();
      form.get("prod").clearValidators();
      form.get("brand").clearValidators();
      form.get("list_id").clearValidators();
      if (!firstTime) {
        form.get("category").setValue("");
        form.get("subCategory").setValue("");
        form.get("prod").setValue("");
      }
    } else if (form.get("type").value == 3) {
      form.get("category").setValidators([Validators.required]);
      form.get("subCategory").setValidators([Validators.required]);
      form.get("link").clearValidators();
      form.get("prod").clearValidators();
      form.get("brand").clearValidators();
      form.get("list_id").clearValidators();
    } else if (form.get("type").value == 4) {
      form.get("brand").setValidators([Validators.required]);
      form.get("link").clearValidators();
      form.get("category").clearValidators();
      form.get("subCategory").clearValidators();
      form.get("prod").clearValidators();
      form.get("list_id").clearValidators();
    } else if (form.get("type").value == 7) {
      form.get("brand").clearValidators();
      form.get("category").clearValidators();
      form.get("subCategory").clearValidators();
      form.get("prod").clearValidators();
      form.get("list_id").clearValidators();
      form.get("link").setValidators([Validators.required]);
      if (!firstTime) {
        form.get("link").setValue("");
      }
    } else if (form.get("type").value == 6) {
      form.get("category").setValidators([Validators.required]);
      form.get("subCategory").clearValidators();
      form.get("link").clearValidators();
      form.get("prod").clearValidators();
      form.get("brand").clearValidators();
      form.get("list_id").clearValidators();
      if (!firstTime) {
        form.get("category").setValue("");
        form.get("prod").setValue("");
      }
    } else if (form.get("type").value == 5) {
      form.get("list_id").setValidators([Validators.required]);
      form.get("subCategory").clearValidators();
      form.get("category").clearValidators();
      form.get("link").clearValidators();
      form.get("prod").clearValidators();
      form.get("brand").clearValidators();
    } else {
      form.get("link").clearValidators();
      form.get("list_id").clearValidators();
      form.get("brand").clearValidators();
      form.get("category").clearValidators();
      form.get("subCategory").clearValidators();
      form.get("prod").clearValidators();
    }
    /*form.get('link').setValue('');
    form.get("category").setValue('');
    form.get("subCategory").setValue('');
    form.get("prod").setValue('');*/
    form.get("list_id").updateValueAndValidity();
    form.get("link").updateValueAndValidity();
    form.get("category").updateValueAndValidity();
    form.get("subCategory").updateValueAndValidity();
    form.get("prod").updateValueAndValidity();
    form.get("brand").updateValueAndValidity();
  }

  viewAd(ad) {
    this.showViewAd = true;
    this.currentAd = ad;
  }

  deleteAd(ad) {
    this.adsService.deleteAd(ad.id).subscribe((res: any) => {
      if (res.code === 200) {
        const ind = this.ads.findIndex((item) => {
          return item.id == ad.id;
        });

        this.ads.splice(ind, 1);
      } else {
        this.toastrService.error(res.message);
      }
    });
  }

  updateAdOrder(ad) {
    this.adsService.updateAds(ad.id, ad).subscribe((response: any) => {
      if (response.code == 200) {
        const ind = this.ads.findIndex((item) => {
          return item.id == ad.id;
        });

        if (ind !== -1) {
          this.ads[ind] = response.data;
        }

        this.currentAd = response.data;
        ad.orderUpdate = false;
      } else {
        this.toastrService.error(response.message);
      }
    });
  }

  onImageSelected(form: FormGroup, event, type) {
    this.selectFile = <File>event.target.files[0];
    this.uploadFile.uploadFile(this.selectFile).subscribe((response: any) => {
      if (response.body) {
        if (type == "image") {
          form.get("image").setValue(response.body.data.filePath);
        } else {
          form.get("image_ar").setValue(response.body.data.filePath);
        }
      }
    });
  }

  onImageSelectedWeb(form: FormGroup, event, type) {
    this.selectFile = <File>event.target.files[0];
    this.uploadFile.uploadFile(this.selectFile).subscribe((response: any) => {
      if (response.body) {
        if (type == "image") {
          form.get("image_web").setValue(response.body.data.filePath);
        } else {
          form.get("image_web_ar").setValue(response.body.data.filePath);
        }
      }
    });
  }

  createAd() {
    if (!this.newAdsForm.valid) {
      return this.markFormGroupTouched(this.newAdsForm);
    }

    let ad = this.newAdsForm.value;
    ad.popup = 0;
    ad.banner_ad = 0;
    if (ad.type == 1) {
      ad.item_id = this.newAdsForm.get("prod").value;
      let selectedProduct = this.productList.filter(
        (product) => product.id == ad.item_id
      )[0];
      ad.link = `${encodeURIComponent(
        selectedProduct.name.replace(/\s/g, "-")
      )}/${selectedProduct.parent_id}?variant=${ad.item_id}`;
    } else if (ad.type == 2) {
      ad.item_id = this.newAdsForm.get("subCategory").value;
    } else if (ad.type == 4) {
      ad.item_id = this.newAdsForm.get("brand").value;
    } else if (ad.type == 5) {
      ad.item_id = this.newAdsForm.get("list_id").value;
    } else if (ad.type == 6) {
      ad.item_id = this.newAdsForm.get("category").value;
    }
    this.submitting = true;
    this.adsService.creatAds(ad).subscribe((response: any) => {
      this.submitting = false;
      this.showAddEditAd = false;
      if (response.code == 200) {
        $("#add-ads").removeClass("open-view-vindor-types");
        this.newAdsForm.reset();
        const ad = response.data;
        ad.deactivated = 0;
        this.ads.push(ad);
      } else {
        this.toastrService.error(response.message);
      }
    });
  }

  updateAd() {
    if (!this.newAdsForm.valid) {
      return this.markFormGroupTouched(this.newAdsForm);
    }

    let ad = this.newAdsForm.value;
    ad.popup = 0;
    ad.banner_ad = 0;
    if (ad.type == 1) {
      ad.item_id = this.newAdsForm.get("prod").value;
      let selectedProduct = this.productList.filter(
        (product) => product.id == ad.item_id
      )[0];
      ad.link = `${encodeURIComponent(
        selectedProduct.name.replace(/\s/g, "-")
      )}/${selectedProduct.parent_id}?variant=${ad.item_id}`;
    } else if (ad.type == 2) {
      ad.item_id = this.newAdsForm.get("subCategory").value;
    } else if (ad.type == 4) {
      ad.item_id = this.newAdsForm.get("brand").value;
    } else if (ad.type == 5) {
      ad.item_id = this.newAdsForm.get("list_id").value;
    } else if (ad.type == 6) {
      ad.item_id = this.newAdsForm.get("category").value;
    }
    this.submitting = true;
    this.adsService.updateAds(ad.id, ad).subscribe((response: any) => {
      this.submitting = false;
      if (response.code == 200) {
        this.showAddEditAd = false;
        $("#add-ads").removeClass("open-view-vindor-types");

        const ind = this.ads.findIndex((item) => {
          return item.id == ad.id;
        });

        if (ind !== -1) {
          this.ads[ind] = response.data;
        }

        this.currentAd = response.data;
      } else {
        this.toastrService.error(response.message);
      }
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

  getCategories() {
    this._CategoriesService.getCategories().subscribe((response: any) => {
      this.categories = response.data;
    });
  }

  onCategoryChange(cat_id, initialData = null) {
    if (!initialData) {
      this.newAdsForm.get("prod").setValue("");
      this.newAdsForm.get("subCategory").setValue("");
    }
    const category_id = this.newAdsForm.get("category").value;
    const index = this.categories.findIndex((item) => item.id == category_id);
    const category = this.categories[index];
    this.sub_categories = category.sub_categories;
  }

  onSubCategoryChange(catId, initialData = null) {
    if (!initialData) {
      this.newAdsForm.get("prod").setValue("");
    }
    const subcategory_id = this.newAdsForm.get("subCategory").value;
    this._CategoriesService
      .getProducts(subcategory_id)
      .subscribe((response: any) => {
        this.productList = response.data;
      });
  }

  getBrands() {
    this.brandsService.getBrands().subscribe((response: any) => {
      this.brands = response.data;
    });
  }

  changeActive(ad) {
    this.ads
      .filter((ad) => {
        return ad.showReason;
      })
      .map((ad) => {
        if (ad.active == ad.deactivated) {
          ad.active = !ad.active;
        }
        ad.showReason = 0;
        return ad;
      });

    if (ad.active) {
      // currently checked
      ad.showReason = 0;
      ad.notes = "";
      if (ad.deactivated) {
        this.adsService.activateAd(ad.id).subscribe((data: any) => {
          ad.active = 1;
          ad.notes = "";
          ad.deactivation_notes = "";
          ad.deactivated = 0;
        });
      }
    } else {
      ad.notes = ad.deactivation_notes;
      ad.showReason = 1;
    }
  }

  cancelDeactivate(ad) {
    ad.active = 1;
    ad.notes = "";
    ad.showReason = 0;
  }

  submitDeactivate(ad) {
    ad.active = 0;
    this.adsService
      .deactivateAd(ad.id, { deactivation_notes: ad.notes })
      .subscribe((data: any) => {
        ad.active = 0;
        ad.deactivation_notes = ad.notes;
        ad.showReason = 0;
        ad.deactivated = 1;
      });
  }
}
