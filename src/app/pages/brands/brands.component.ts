import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { BrandsService } from "@app/pages/services/brands.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import { UploadFilesService } from "../services/upload-files.service";
import { ToastrService } from "ngx-toastr";
import { ProductsService } from "../services/products.service";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "environments/environment.prod";

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
  addBrand: boolean;
  viewEditBrand: boolean;
  constructor(
    private brandsService: BrandsService,
    private uploadService: UploadFilesService,
    private toastrService: ToastrService,
    private cd: ChangeDetectorRef,
    private productsService: ProductsService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    $(".slider").on("click", function () {
      const then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });

    this.spinner.show();
    this.brandsService.getBrands().subscribe((response: any) => {
      this.spinner.hide();
      this.brands = response.data;
    });

    this.addBrandForm = new FormGroup({
      name: new FormControl("", Validators.required),
      name_ar: new FormControl("", Validators.required),
      image: new FormControl("", Validators.required),
    });
  }

  resetForm() {
    this.addBrand = true;
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
        this.addBrand = false;
        this.toastrService.success("Brand Added Successfully");
        this.submitting = true;
        this.brands.push(response.data);
        $("#add-prod").toggleClass("open-view-vindor-types");
      });
  }

  editBrand(brand) {
    this.viewEditBrand = true;
    this.editForm = new FormGroup({
      id: new FormControl(brand.id, Validators.required),
      name: new FormControl(brand.name, Validators.required),
      name_ar: new FormControl(brand.name_ar, Validators.required),
      image: new FormControl(brand.image, Validators.required),
    });
    this.imageUrl = brand.image;
    $("#edit-prod").toggleClass("open-view-vindor-types");
  }

  // uploadFile(event) {
  //   const formData = new FormData();
  //   const selectFile = <File>event.target.files[0];
  //   formData.append("file",selectFile);
  //   this.brandsService
  //     .ImportBrands(formData)
  //     .subscribe((response: any) => {
  //       if(response.code===200){
  //       this.toastrService.success("File uploaded successfully");
  //       this.importFile.nativeElement.value = "";
  //       }
  //       else{
  //         this.toastrService.error(response.errors[0]);
  //       }
  //     });
  // }

  uploadFile(event) {
    let fileName = <File>event.target.files[0];
    this.productsService.import(fileName, "1").subscribe((response: any) => {
      if (response.code == 200) {
        this.toastrService.success("File uploaded successfully");
      } else {
        this.toastrService.error(response.message);
      }
    });
  }

  exportCsv() {
    const exportStock = environment.api + "/api/admin/brands/export";

    this.productsService.exportFile(exportStock).subscribe({
      next: (rep: any) => { },
    });
    setTimeout(() => {
      this.toastrService.success(
        "You’ll receive a notification when the export is ready for download.",
        " Your export is now being generated ",
        {
          enableHtml: true,
          timeOut: 3000,
        }
      );
    }, 500);
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
        this.viewEditBrand = false;
        this.toastrService.success("Brand Updated Successfully");
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
    if (file.size > 7048576) {
      alert("file size is too big max size is 1MB");
    } else {
      this.uploadService.uploadFile(file).subscribe((response: any) => {
        if (response.body) {
          this.imageUrl = response.body.data.filePath;
        }
      });
    }
  }

  formControlValidator(controlName, err) {
    if (
      this.editForm &&
      this.editForm.controls[controlName].touched &&
      this.editForm.controls[controlName].dirty
    ) {
      if (this.editForm.controls[controlName].errors) {
        return this.editForm.controls[controlName].errors[err];
      }
    } else if (
      this.addBrandForm &&
      this.addBrandForm.controls[controlName].touched &&
      this.addBrandForm.controls[controlName].dirty
    ) {
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
