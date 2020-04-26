import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BrandsService } from '@app/pages/services/brands.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UploadFilesService } from '../services/upload-files.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {
  editForm: FormGroup;

  brands = [];

  addBrandForm: FormGroup;

  imageUrl;
  searchTerm: string;

  constructor(private brandsService: BrandsService, private uploadService: UploadFilesService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
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

    $('#show-p-details').on('click',   '#close-vindors4', function () {
      $('#show-p-details').removeClass('open-view-vindor-types');
    });

    this.brandsService.getBrands()
      .subscribe((response: any) => {
        this.brands = response.data;
        console.log(this.brands);
      })

    this.addBrandForm = new FormGroup({
      name: new FormControl('', Validators.required),
      name_ar: new FormControl('', Validators.required),
      image: new FormControl('')
    });
  }

  resetForm () {
    this.addBrandForm.reset();
    this.imageUrl = "";
  }

  createBrand () {
    if (!this.addBrandForm.valid) {
      return this.markFormGroupTouched(this.addBrandForm);
    }

    this.brandsService.createBrand(this.addBrandForm.value)
      .subscribe((response: any) => {
        this.brands.push(response.data);
        $('#add-prod').toggleClass('open-view-vindor-types');
      });
  }

  editBrand (brand) {
    this.editForm = new FormGroup({
      id: new FormControl(brand.id, Validators.required),
      name: new FormControl(brand.name, Validators.required),
      name_ar: new FormControl(brand.name_ar, Validators.required),
      image: new FormControl(brand.image)
    })
    this.imageUrl = brand.image;
    $('#edit-prod').toggleClass('open-view-vindor-types');
  }

  updateBrand () {
    console.log(this.editForm.value)
    if (!this.editForm.valid) {
      console.log("INVALID");
      return this.markFormGroupTouched(this.editForm);
    }

    let brand = this.editForm.value;

    this.brandsService.updateBrand(brand.id, brand)
      .subscribe((response: any) => {
        let ind = this.brands.findIndex(item => {
          return item.id === brand.id;
        });
        console.log(ind);
        if (ind !== -1) {
          this.brands[ind] = response.data;
        }
        let term = this.searchTerm;
        this.searchTerm = ''
        this.cd.detectChanges();
        this.searchTerm = term;
        $('#edit-prod').toggleClass('open-view-vindor-types');
      })
  }

  onImageSelected(event) {
    let file = <File>event.target.files[0];
    this.uploadService.uploadFile(file)
      .subscribe((response: any) => {

        if (response.body) {
          this.imageUrl = response.body.data.filePath;
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
}

