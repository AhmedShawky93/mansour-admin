import { Component, OnInit } from '@angular/core';
import { AdsService } from '@app/pages/services/ads.service';
import { UploadFilesService } from '@app/pages/services/upload-files.service';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '@app/pages/services/category.service';

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class adsComponent implements OnInit {
  category_id: any;
  editFormGroup: FormGroup;
  public productList: any[];

  p = 1;
  total;

  categories: any;
  adCrrentEdit: any = [];
  id;
  editA;
  product;
  seclecAds;
  adView;
  adUpdate: any = {

  };
  editAd: any = {

  };
  sub_categories: any[];

  Product_name: any;

  category;

  ads = [
  ];

  ad: any =
    {
      type: '',
      image: '',
      item_id: '',

    };



  selectFile = null;

  newAdsForm: FormGroup;

  selectedSubcategory: any;

  selectedProductId: any;

  constructor(private adsService: AdsService,
    private uploadFile: UploadFilesService,
    private toastrService: ToastrService,
    private _CategoriesService: CategoryService,
  ) { }





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

    this.getAd();
    this.getCategories();

    this.newAdsForm = new FormGroup({
      type: new FormControl('', Validators.required),
      popup: new FormControl(''),
      order: new FormControl(''),
      banner_title: new FormControl(''),
      banner_title_ar: new FormControl(''),
      banner_description: new FormControl(''),
      banner_description_ar: new FormControl(''),
      category: new FormControl('', ),
      subCategory: new FormControl('', ),
      prod: new FormControl('', ),
      image: new FormControl('', )
    });

    this.ad.popup = "";

    this.editFormGroup = new FormGroup({
      type: new FormControl('', Validators.required),
      popup: new FormControl(''),
      order: new FormControl(''),
      banner_title: new FormControl(''),
      banner_title_ar: new FormControl(''),
      banner_description: new FormControl(''),
      banner_description_ar: new FormControl(''),
      banner_ad: new FormControl(),
      category: new FormControl('', ),
      subCategory: new FormControl('', ),
      prod: new FormControl('', ),
      image: new FormControl('')
    });

    // this.editFormGroup.valueChanges
    //   .subscribe( values => {
    //     console.log("VALUES", values);
    //     if (values.banner_ad) {
    //       this.editFormGroup.get('order').setValidators(null);
    //       this.editFormGroup.get('popup').setValidators(null);
    //     } else {
    //       this.editFormGroup.get('order').setValidators([Validators.required]);
    //       this.editFormGroup.get('popup').setValidators([Validators.required]);
    //     }
    //     this.editFormGroup.get('order').updateValueAndValidity();
    //     this.editFormGroup.get('popup').updateValueAndValidity();
    //   });

  }

  getAd() {
    this.adsService.getAds()
      .subscribe((response: any) => {
        this.ads = response.data;
        this.ads = this.ads.map(item => {
          item.deactivated = !item.active;
          return item;
        });
        this.total = this.ads.length;
      });
  }

  getAdId(ad) {
    this.adsService.getAdsId(ad.id)
      .subscribe((response: any) => {
        this.seclecAds = response.data;
      });
  }




  editdForm(ad) {
    if (!this.editFormGroup.valid) {
      console.log(this.editFormGroup.value, this.editFormGroup.errors);

      this.markFormGroupTouched(this.editFormGroup);
      return;
    }

    if (ad.type == 1) {
      ad.item_id = this.selectedProductId;
    } else if (ad.type == 2) {
      ad.item_id = this.selectedSubcategory;
    }

    this.adsService.updateAds(ad.id, ad)
      .subscribe((response: any) => {
        if (response.code == 200) {

          $('#edit-ads').removeClass('open-view-vindor-types');

          const ind = this.ads.findIndex(item => {
            return item.id == ad.id;
          });


          if (ind !== -1) {
            this.ads[ind] = response.data;
          }

          this.seclecAds = response.data;

        } else {
          this.toastrService.error(response.message);
        }

      });
  }

  editCurrentAd(adCrrent) {
    this.adCrrentEdit = JSON.parse(JSON.stringify(adCrrent));
    this.adCrrentEdit.imageUrl = this.adCrrentEdit.image;

    this.category_id = this.adCrrentEdit.category_id;
    this.selectedSubcategory = this.adCrrentEdit.sub_category_id;
    this.selectedProductId = this.adCrrentEdit.product_id;

    // fill select options
    if (this.adCrrentEdit.type == 1 || this.adCrrentEdit.type == 2) {
      this.selectCategory(this.category_id);

      if (this.adCrrentEdit.type == 1) {
        this.loadProducts(this.selectedSubcategory);
      }
    }
  }

  onAdTypeChanged(form: FormGroup) {
    if (form.get('type').value == 1) {
      form.get('category').setValidators([Validators.required]);
      form.get('subCategory').setValidators([Validators.required]);
      form.get('prod').setValidators([Validators.required]);
    } else if (form.get('type').value == 2) {
      form.get('category').setValidators([Validators.required]);
      form.get('subCategory').setValidators([Validators.required]);
      form.get('prod').clearValidators();
    } else {
      form.get('category').clearValidators();
      form.get('subCategory').clearValidators();
      form.get('prod').clearValidators();
    }
    form.get('category').updateValueAndValidity();
    form.get('subCategory').updateValueAndValidity();
    form.get('prod').updateValueAndValidity();

    this.category_id = null;
    this.selectedSubcategory = null;
    this.productList = [];
  }

  viewAd(adView) {
    this.seclecAds = adView;
  }

  onimgeSelected(ad, event) {
    this.selectFile = <File>event.target.files[0];
    this.uploadFile.uploadFile(this.selectFile)
      .subscribe((response: any) => {

        if (response.body) {
          ad.image = response.body.data.name;
          ad.imageUrl = response.body.data.filePath;
        }

      });
  }

  newAdForm(ad) {
    console.log(this.newAdsForm.value);
    if (!this.newAdsForm.valid) {
      this.markFormGroupTouched(this.newAdsForm);
      return;
    }

    if (ad.type == 1) {
      ad.item_id = this.selectedProductId;
    } else if (ad.type == 2) {
      ad.item_id = this.selectedSubcategory;
    }

    this.adsService.creatAds(ad)
      .subscribe((response: any) => {
        if (response.code == 200) {
          $('#add-ads').removeClass('open-view-vindor-types');
          this.ad.image = '',
          this.ad.imageUrl = '';
          this.newAdsForm.reset();
          const ad = response.data;
          ad.deactivated = 0;
          this.ads.push(ad);
        } else {
          this.toastrService.error(response.message);
        }

      });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
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


  selectCategory(cat_id) {
    console.log(cat_id);
    const index = this.categories.findIndex(item => item.id == cat_id);
    const category = this.categories[index];
    this.sub_categories = category.sub_categories;
  }




  loadProducts(catId) {
    this._CategoriesService.getProducts(catId)
      .subscribe((response: any) => {
        this.productList = response.data;
      });
  }




  changeActive(ad) {
    this.ads.filter((ad) => {
      return ad.showReason;
    }).map((ad) => {
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
        this.adsService.activateAd(ad.id)
          .subscribe((data: any) => {
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
    this.adsService.deactivateAd(ad.id, {deactivation_notes: ad.notes})
      .subscribe((data: any) => {
        ad.active = 0;
        ad.deactivation_notes = ad.notes;
        ad.showReason = 0;
        ad.deactivated = 1;
      });
  }

}
