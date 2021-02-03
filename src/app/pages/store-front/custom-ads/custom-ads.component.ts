import { Component, OnInit } from '@angular/core';
import { AdsService } from '@app/pages/services/ads.service';
import { UploadFilesService } from '@app/pages/services/upload-files.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  NgForm,
  ValidationErrors,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '@app/pages/services/category.service';
import { BrandsService } from '@app/pages/services/brands.service';
import { CustomAdsService } from '@app/pages/services/custom-ads.service';

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-custom-ads',
  templateUrl: './custom-ads.component.html',
  styleUrls: ['./custom-ads.component.css'],
})
export class CustomAdsComponent implements OnInit {
  category_id: any;
  editFormGroup: FormGroup;
  public productList: any[];
  brands = [];
  p = 1;
  total;

  categories: any;
  adCrrentEdit: any = [];
  id;
  product;
  adView;
  sub_categories: any[];

  category;

  ads = [];

  ad: any = {
    type: '',
    image: '',
    image_ar: '',
    item_id: '',
  };

  selectFile = null;

  newAdsForm: FormGroup;

  selectedSubcategory: any;

  selectedProductId: any;
  brand_id: any;
  currentAd: any;

  constructor(
    private adsService: CustomAdsService,
    private uploadFile: UploadFilesService,
    private toastrService: ToastrService,
    private _CategoriesService: CategoryService,
    private brandsService: BrandsService
  ) {}

  ngOnInit() {
    $('.owls-table').on('click', '.toggle-view-category', function () {
      $('#view-category').toggleClass('open-view-vindor-types');
    });

    // add new side bar
    $('.add-new').on('click', function () {
      $('#add-ads').toggleClass('open-view-vindor-types');
    });

    // add edit side bar
    // $(".table").on("click", ".open-edit", function () {
    //   $("#edit-ads").toggleClass("open-view-vindor-types")
    // });
    $('.open-edit').on('click', function () {
      $('#edit-ads').toggleClass('open-view-vindor-types');
    });

    // view side bar
    $('.table').on('click', '.view-ads', function () {
      $('#view-ads').toggleClass('open-view-vindor-types');
    });

    // close
    $('#view-category').on('click', '#close-vindors1', function () {
      $('#view-category').removeClass('open-view-vindor-types');
    });

    $('#close-vindors2').on('click', function () {
      $('#add-ads').removeClass('open-view-vindor-types');
    });

    $('#close-vindors3').on('click', function () {
      $('#edit-ads').removeClass('open-view-vindor-types');
    });

    $('#close-view').on('click', function () {
      $('#view-ads').removeClass('open-view-vindor-types');
    });

    $('.switch').on('click', '.slider', function () {
      const then = $(this).siblings('.reason-popup').slideToggle(100);
      $('.reason-popup').not(then).slideUp(50);
    });

    this.getAds();
    this.getCategories();
    this.getBrands();

    this.newAdsForm = new FormGroup({
      id: new FormControl(),
      name_en: new FormControl('', Validators.required),
      name_ar: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      category: new FormControl(''),
      subCategory: new FormControl(''),
      prod: new FormControl(''),
      image_en: new FormControl('', Validators.required),
      image_ar: new FormControl('', Validators.required),
      image_web: new FormControl('', Validators.required),
      image_web_ar: new FormControl('', Validators.required),
      dev_key: new FormControl('', Validators.required),
      brand: new FormControl(),
    });

    this.ad.popup = '';
  }

  getAds() {
    this.adsService.getAds().subscribe((response: any) => {
      this.ads = response.data;
      this.ads = this.ads.map((item) => {
        item.deactivated = !item.active;
        return item;
      });
      this.total = this.ads.length;
    });
  }

  onFormSubmit(form: FormGroup) {
    debugger
    if (this.newAdsForm.value.id != null) {
      this.updateAd();
    } else {
      this.createAd();
    }
  }

  editAd(ad) {
    debugger;
    console.log(ad);
    this.newAdsForm = new FormGroup({
      id: new FormControl(ad.id),
      type: new FormControl(ad.type, Validators.required),
      name_en: new FormControl(ad.name_en, Validators.required),
      name_ar: new FormControl(ad.name_ar, Validators.required),
      image_en: new FormControl(ad.image_en, Validators.required),
      image_ar: new FormControl(ad.image_ar, Validators.required),
      image_web: new FormControl((ad.image_web) ? ad.image_web : '', Validators.required),
      image_web_ar: new FormControl((ad.image_web_ar) ? ad.image_web_ar : '', Validators.required),
      dev_key: new FormControl(ad.dev_key, Validators.required),
      category: new FormControl(),
      subCategory: new FormControl(),
      prod: new FormControl(),
      brand: new FormControl(),
      /*dev_key: new FormControl(ad.dev_key)*/
    });
    if (ad.type == 1) {
      this.newAdsForm.get('prod').setValue(ad.item_id);
      this.newAdsForm.get('subCategory').setValue(ad.item_data.category_id);
      this.newAdsForm.get('category').setValue(ad.item_data.category.id);
    } else if (ad.type == 2) {
      this.newAdsForm.get('subCategory').setValue(ad.item_id);
      this.newAdsForm.get('category').setValue(ad.item_data.parent_id);
    } else if (ad.type == 4) {
      this.newAdsForm.get('brand').setValue(ad.item_id);
    }
    console.log(this.newAdsForm.value);

    this.category_id = this.newAdsForm.get('category').value;
    this.selectedSubcategory = this.newAdsForm.get('subCategory').value;
    this.selectedProductId = this.newAdsForm.get('prod').value;

    // fill select options
    if (ad.type == 1 || ad.type == 2) {
      this.onCategoryChange(this.category_id);

      if (ad.type == 1) {
        this.onSubCategoryChange(this.selectedSubcategory);
      }
    }

    this.onAdTypeChanged(this.newAdsForm);
  }

  onAdTypeChanged(form: FormGroup) {
    if (form.get('type').value == 1) {
      form.get('category').setValidators([Validators.required]);
      form.get('subCategory').setValidators([Validators.required]);
      form.get('prod').setValidators([Validators.required]);
      form.get('brand').clearValidators();
    } else if (form.get('type').value == 3) {
      form.get('category').setValidators([Validators.required]);
      form.get('subCategory').setValidators([Validators.required]);
      form.get('prod').clearValidators();
      form.get('brand').clearValidators();
    } else if (form.get('type').value == 4) {
      form.get('brand').setValidators([Validators.required]);
      form.get('category').clearValidators();
      form.get('subCategory').clearValidators();
      form.get('prod').clearValidators();
    } else {
      form.get('brand').clearValidators();
      form.get('category').clearValidators();
      form.get('subCategory').clearValidators();
      form.get('prod').clearValidators();
    }

    form.get('category').updateValueAndValidity();
    form.get('subCategory').updateValueAndValidity();
    form.get('prod').updateValueAndValidity();
    form.get('brand').updateValueAndValidity();
  }

  viewAd(ad) {
    this.currentAd = ad;
  }

  onImageSelected(form: FormGroup, event, type) {
    this.selectFile = <File>event.target.files[0];
    this.uploadFile.uploadFile(this.selectFile).subscribe((response: any) => {
      if (response.body) {
        form.get(type).setValue(response.body.data.filePath);
      }
    });
  }

  createAd() {
    debugger
    console.log(this.newAdsForm.value);
    if (!this.newAdsForm.valid) {
      return this.markFormGroupTouched(this.newAdsForm);
    }

    const ad = this.newAdsForm.value;

    if (ad.type == 1) {
      ad.item_id = this.newAdsForm.get('prod').value;
    } else if (ad.type == 2) {
      ad.item_id = this.newAdsForm.get('subCategory').value;
    } else if (ad.type == 4) {
      ad.item_id = this.newAdsForm.get('brand').value;
    }

    this.adsService.creatAds(ad).subscribe((response: any) => {
      if (response.code == 200) {
        $('#add-ads').removeClass('open-view-vindor-types');
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
    debugger
    console.log(this.newAdsForm.value);
    if (!this.newAdsForm.valid) {
      return this.markFormGroupTouched(this.newAdsForm);
    }

    const ad = this.newAdsForm.value;

    if (ad.type == 1) {
      ad.item_id = this.newAdsForm.get('prod').value;
    } else if (ad.type == 2) {
      ad.item_id = this.newAdsForm.get('subCategory').value;
    } else if (ad.type == 4) {
      ad.item_id = this.newAdsForm.get('brand').value;
    }

    this.adsService.updateAds(ad.id, ad).subscribe((response: any) => {
      if (response.code == 200) {
        $('#add-ads').removeClass('open-view-vindor-types');

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
      console.log(this.categories);
    });
  }

  onCategoryChange(cat_id) {
    const category_id = this.newAdsForm.get('category').value;
    console.log(category_id, this.categories);
    const index = this.categories.findIndex((item) => item.id == category_id);
    const category = this.categories[index];
    this.sub_categories = category.sub_categories;
    console.log(this.sub_categories);
  }

  onSubCategoryChange(catId) {
    const subcategory_id = this.newAdsForm.get('subCategory').value;
    console.log(subcategory_id);
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
      ad.notes = '';
      if (ad.deactivated) {
        this.adsService.activateAd(ad.id).subscribe((data: any) => {
          ad.active = 1;
          ad.notes = '';
          ad.deactivation_notes = '';
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
    ad.notes = '';
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
