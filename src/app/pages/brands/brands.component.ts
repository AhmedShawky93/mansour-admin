import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { BrandsService } from "@app/pages/services/brands.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import { UploadFilesService } from "../services/upload-files.service";
import { ToastrService } from "ngx-toastr";
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-brands",
  templateUrl: "./brands.component.html",
  styleUrls: ["./brands.component.css"],
})
export class BrandsComponent implements OnInit {
  editForm: FormGroup;
  @ViewChild("myInput") importFile: ElementRef;
  submitting: boolean = false;
  brands = [];

  addBrandForm: FormGroup;

  imageUrl;
  searchTerm: string;
  p = 1;
  constructor(
    private brandsService: BrandsService,
    private uploadService: UploadFilesService,
    private toastrService: ToastrService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
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

    this.brandsService.getBrands().subscribe((response: any) => {
      this.brands = response.data;
    });

    this.addBrandForm = new FormGroup({
      name: new FormControl("", Validators.required),
      name_ar: new FormControl("", Validators.required),
      image: new FormControl("", Validators.required),
    });
  }

  resetForm() {
    this.addBrandForm.reset();
    this.imageUrl = "";
  }

  createBrand() {
    if (!this.addBrandForm.valid) {
      return this.markFormGroupTouched(this.addBrandForm);
    }
    this.submitting = true;

    this.brandsService
      .createBrand(this.addBrandForm.value)
      .subscribe((response: any) => {
        this.submitting = true;
        this.brands.push(response.data);
        $("#add-prod").toggleClass("open-view-vindor-types");
      });
  }

  editBrand(brand) {
    this.editForm = new FormGroup({
      id: new FormControl(brand.id, Validators.required),
      name: new FormControl(brand.name, Validators.required),
      name_ar: new FormControl(brand.name_ar, Validators.required),
      image: new FormControl(brand.image, Validators.required),
    });
    this.imageUrl = brand.image;
    $("#edit-prod").toggleClass("open-view-vindor-types");
  }

  uploadFile(event) {
    const formData = new FormData();
    const selectFile = <File>event.target.files[0];
    formData.append("file",selectFile);
    this.brandsService
      .ImportBrands(formData)
      .subscribe((response: any) => {
        if(response.code===200){
        this.toastrService.success("File uploaded successfully");
        this.importFile.nativeElement.value = "";
        }
        else{
          this.toastrService.error(response.errors[0]);
        }
      });

   
  }
  exportCsv(){
    this.brandsService.exportBrands().subscribe((data:any)=>{
        const blob = new Blob([data], { type: 'text/csv' });
        // const url= window.URL.createObjectURL(blob);
        // window.open(url);
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        // Give filename you wish to download
        a.download = "Brands.xls";
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
    })
  }

  updateBrand() {
    if (!this.editForm.valid) {
      return this.markFormGroupTouched(this.editForm);
    }
    this.submitting = true;
    let brand = this.editForm.value;

    this.brandsService
      .updateBrand(brand.id, brand)
      .subscribe((response: any) => {
        this.submitting = false;
        let ind = this.brands.findIndex((item) => {
          return item.id === brand.id;
        });
        if (ind !== -1) {
          this.brands[ind] = response.data;
        }
        let term = this.searchTerm;
        this.searchTerm = "";
        this.cd.detectChanges();
        this.searchTerm = term;
        $("#edit-prod").toggleClass("open-view-vindor-types");
      });
  }

  onImageSelected(event) {
    let file = <File>event.target.files[0];
    if (file.size > 1048576) {
      alert('file size is too big max size is 1MB')
    } else {
      this.uploadService.uploadFile(file).subscribe((response: any) => {
        if (response.body) {
          this.imageUrl = response.body.data.filePath;
        }
      });
    }
  }
  formControlValidator(controlName, err) {
    if (this.editForm && this.editForm.controls[controlName].touched && this.editForm.controls[controlName].dirty) {
      if (this.editForm.controls[controlName].errors) {
        return this.editForm.controls[controlName].errors[err];
      }
    } else if (this.addBrandForm && this.addBrandForm.controls[controlName].touched && this.addBrandForm.controls[controlName].dirty){
      if (this.addBrandForm.controls[controlName].errors) {
        return this.addBrandForm.controls[controlName].errors[err];
      }
    }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
