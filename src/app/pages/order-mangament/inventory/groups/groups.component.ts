import { CategoryService } from '@app/pages/services/category.service';
import { GroupsService } from './../../../services/groups.service';
import { OptionsService } from "./../../../services/options.service";
import { Component, ElementRef, OnInit } from "@angular/core";
import { UploadFilesService } from "@app/pages/services/upload-files.service";
import { ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { Validators } from "@angular/forms";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-groups",
  templateUrl: "./groups.component.html",
  styleUrls: ["./groups.component.css"],
})
export class GroupsComponent implements OnInit {
  showSubError: number;
  @ViewChild("myInput") importFile: ElementRef;
  groups: any;
  newCategory: any = {
    name: "",
    description: "",
    sub_categories: [],
  };

  currentGroup;
  editGroup;

  sCatnumber: any = 0;

  searchTerm;

  editGroupForm: FormGroup;
  groupForm: FormGroup;
  p = 1;

  // @ViewChild('formGroup') formGroup : NgForm;
  options: any;
  categories: any;
  sub_categories: any;

  constructor(
    private groupsService: GroupsService,
    private uploadService: UploadFilesService,
    private toastrService: ToastrService,
    private _CategoriesService: CategoryService,
    private optionsService: OptionsService
  ) { }

  ngOnInit() {
    this.getGroups();
    this.getCategories();
    $(".add-category").on("click", function () {
      $("#add-cat").toggleClass("open-view-vindor-types");
    });

    $("#edit-category").on("click", function () {
      $("#edit-cat").toggleClass("open-view-vindor-types");
    });

    $(".table").on("click", ".view-c", function () {
      $("#view-category").toggleClass("open-view-vindor-types");
    });
    //   $(".btn-big add-category").on("click", function () {
    //     $("#add-cat").removeClass("open-view-vindor-types")
    //   })

    $(".switch").on("click", ".slider", function () {
      var then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });

    //      // manage-charges
    //  $(".owls-table").on("click", ".edit-manage-charges", function () {
    //   $("#manage-charges").toggleClass("open-view-vindor-types")
    //   // $(".left-sidebar").toggleClass("toggle-left-sidebar")
    //   // $("i", this).toggleClass(" icon-Exit fa fa-bars");
    // })

    $("#close-vindors1").on("click", function () {
      $("#add-cat").removeClass("open-view-vindor-types");
    });

    $("#close-vindors2").on("click", function () {
      $("#edit-cat").removeClass("open-view-vindor-types");
    });

    $("#close-vindors3").on("click", function () {
      $("#view-category").removeClass("open-view-vindor-types");
    });

    this.groupForm = new FormGroup({
      name_en: new FormControl("", [
        Validators.required,
        Validators.pattern(/[A-Za-z0-9\-\&\s]+$/),
      ]),
      name_ar: new FormControl("", [Validators.required]),
      description_en: new FormControl("", Validators.required),
      description_ar: new FormControl("", Validators.required),
      image: new FormControl("", [Validators.required]),
      categories_id: new FormControl("", Validators.required),
      sub_categories: new FormControl([], Validators.required),
      order: new FormControl(0, Validators.required),
    });
  }


  getCategories() {
    this._CategoriesService.getCategories().subscribe((response: any) => {
      if (response.code === 200) {
        this.categories = response.data;
      }
    });
  }
  uploadFile(event) {
    const formData = new FormData();
    const selectFile = <File>event.target.files[0];
    formData.append("file",selectFile);
    this.groupsService
      .ImportGroups(formData)
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
    this.groupsService.exportGroups().subscribe((data:any)=>{
        const blob = new Blob([data], { type: 'text/csv' });
        // const url= window.URL.createObjectURL(blob);
        // window.open(url);
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        // Give filename you wish to download
        a.download = "Groups.xls";
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
    })
  }

  selectCategory(cat_id) {
    let index = this.categories.findIndex((item) => item.id == cat_id);
    if (index !== -1) {
      let category = this.categories[index];
      this.sub_categories = category.sub_categories;
    }
  }

  getGroups() {
    this.groupsService.getGroups().subscribe((response: any) => {
      this.groups = response.data;
      this.groups = this.groups.map((item) => {
        item.deactivated = !item.active;
        return item;
      });
    });
  }

  createGroup(group) {
    if (!this.groupForm.valid) {
      this.markFormGroupTouched(this.groupForm);
      return;
    }

    group = this.groupForm.value;

    this.groupsService
      .createGroup(group)
      .subscribe((response: any) => {
        if (response.code == 200) {
          this.groups.push(response.data);
          $("#add-cat").toggleClass("open-view-vindor-types");
          this.showSubError = 0;
          this.groupForm.reset();
        } else {
          this.toastrService.error(response.message);
        }
      });
  }
  viewGroup(group) {
    this.currentGroup = group
    // this.currentGroup.sub_categories.map((cat) => {
    //   cat.deactivated = !cat.active;
    //   return cat;
    // });
  }

  editCategory(category) {
    this.editGroup = JSON.parse(JSON.stringify(category));

    // this.editCat.sub_categories.map(cat => {
    //   cat.imageUrl = cat.image;
    //   return cat;
    // })

    // this.editCat.deleted_ids = [];

    this.editGroupForm = new FormGroup({
      id: new FormControl(category.id),
      name_en: new FormControl(category.name_en, [
        Validators.required,
        Validators.pattern(/[A-Za-z0-9\-\&\s]+$/),
      ]),
      name_ar: new FormControl(category.name_ar, [Validators.required]),
      description_en: new FormControl(category.description_en, Validators.required),
      description_ar: new FormControl(
        category.description_ar,
        Validators.required
      ),
      image: new FormControl(category.image, [Validators.required]),
      categories_id: new FormControl(category.category_id, Validators.required),
      sub_categories: new FormControl(category.sub_categories.map(c => c.id), Validators.required),
      order: new FormControl(category.order ? category.order : 0, Validators.required),
    });

    this.selectCategory(category.category_id)
  }

  updateGroup(group) {
    if (!this.editGroupForm.valid) {
      this.markFormGroupTouched(this.editGroupForm);
      return;
    }

    group = this.editGroupForm.value;

    this.groupsService
      .updateGroup(group.id, group)
      .subscribe((response: any) => {
        if (response.code) {
          $("#edit-cat").toggleClass("open-view-vindor-types");
          let group = response.data;
          group.deactivated = !group.active;

          group.sub_categories.map((cat) => {
            cat.deactivated = !cat.active;
            return cat;
          });

          this.currentGroup = group;
          let ind = this.groups.findIndex((item) => item.id == group.id);
          if (ind !== -1) {
            this.groups[ind] = group;
          }
          (this.newCategory.name = ""), (this.newCategory.description = "");
        } else {
          this.toastrService.error(response.message);
        }
      });
  }

  uploadImage(image, e: any) {
    let fileList: FileList = e.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      // if(file.size > 3000000) {
      //   this.showVendorSizeError = true;
      //   return
      // }else{
      //   this.showVendorSizeError = false;
      // }

      // var reader = new FileReader();

      // reader.onload = (e: any) => {
      //   category.imageUrl = e.target.result;
      // }

      // reader.readAsDataURL(e.target.files[0]);

      this.uploadService.uploadFile(file).subscribe((response: any) => {
        // this.isUploadingVendor = false;
        if (response.body) {
          image.setValue(response.body.data.filePath);
          // category.image = response.body.data.name;
          // category.imageUrl = response.body.data.filePath;
          // category.showError = 0;
        }
      });
    }
  }

  uploadImageEdit(category, e: any) {
    let fileList: FileList = e.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];


      this.uploadService.uploadFile(file).subscribe((response: any) => {
        // this.isUploadingVendor = false;
        if (response.body) {
          category.image = response.body.data.name;
          category.imageUrl = response.body.data.filePath;
          category.showError = 0;
        }
      });
    }
  }



  changeActive(group) {
    this.groups
      .filter((group) => {
        return group.showReason;
      })
      .map((group) => {
        if (group.active == group.deactivated) {
          group.active = !group.active;
        }
        group.showReason = 0;
        return group;
      });
    if (group.active) {
      // currently checked
      group.showReason = 0;
      group.notes = "";
      if (group.deactivated) {
        this.groupsService
          .activateGroup(group.id)
          .subscribe((data: any) => {
            group.active = 1;
            group.notes = "";
            group.deactivation_notes = "";
            group.deactivated = 0;
          });
      }
    } else {
      group.notes = group.deactivation_notes;
      group.showReason = 1;
    }
  }

  cancelDeactivate(group) {
    group.active = 1;
    group.notes = "";
    group.showReason = 0;
  }

  submitDeactivate(group) {
    group.active = 0;
    this.groupsService
      .deactivateGroup(group.id, { deactivation_notes: group.notes })
      .subscribe((data: any) => {
        group.active = 0;
        group.deactivation_notes = group.notes;
        group.showReason = 0;
        group.deactivated = 1;
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
}
