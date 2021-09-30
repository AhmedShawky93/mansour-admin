import { Component, OnInit, OnChanges } from "@angular/core";
import { DeliveryService } from "@app/pages/services/delivery.service";
import { StaffService } from "@app/pages/services/staff.service";
import { UploadFilesService } from "@app/pages/services/upload-files.service";
import { AreasService } from "@app/pages/services/areas.service";
import { AuthService } from "@app/shared/auth.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { environment } from "@env/environment";
import { ToastrService } from "ngx-toastr";
import { SettingService } from "@app/pages/services/setting.service";
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-staff",
  templateUrl: "./staff.component.html",
  styleUrls: ["./staff.component.css"],
})
export class StaffComponent implements OnInit {
  show = false;
  hide = true;
  searchTerm: any;
  date: any;
  selectFile = null;
  deliverers: any = [];
  newUser = {
    image: "",
  };
  editStaff;
  addStaff;
  currentUser: any;
  editUser: any = {};
  event;
  showError: number;

  newDeliverer: any = {
    name: "",
    address: "",
    birthdate: "",
    area_id: "",
    unique_id: "",
    image: "",
    email: "",
    phone: "",
  };

  cities: any[];
  area_list: any[];

  token: string;
  exportUrl: string;

  city_id: any;

  today = new Date();
  environmentVariables: any;

  constructor(
    private deliverService: DeliveryService,
    private uploadFiles: UploadFilesService,
    private areaService: AreasService,
    private auth: AuthService,
    private toastrService: ToastrService,
    private settingService: SettingService
  ) {}

  ngOnChanges() {
    // this.onFileSelected(event);
  }

  getConfig() {
    this.settingService.getenvConfig().subscribe(res => {
      this.environmentVariables = res;
      this.addStaff.controls.phone.setValidators(
        [
          Validators.required,
          Validators.minLength(this.environmentVariables.localization.phone_length),
          Validators.maxLength(this.environmentVariables.localization.phone_length),
          Validators.pattern(this.environmentVariables.localization.phone_pattern)
        ]
      )
      this.addStaff.controls.phone.updateValueAndValidity()
    })
  }

  onFileSelected(event, user) {
    this.selectFile = <File>event.target.files[0];
    this.uploadFiles.uploadFile(this.selectFile).subscribe((response: any) => {
      if (response.body) {
        user.image = response.body.data.name;
        user.imageUrl = response.body.data.filePath;
        this.showError = 0;
      }
    });
  }

  ngOnInit() {
    $(".open-add").on("click", function () {
      $("#add-man").toggleClass("open-view-vindor-types");
    });

    $(".open-edit").on("click", function () {
      $("#edit-man").toggleClass("open-view-vindor-types");
    });

    $(".open-view").on("click", function () {
      $("#view-man").toggleClass("open-view-vindor-types");
    });

    $(".open-choose").on("click", function (event) {
      event.preventDefault();
      $(".choose").slideToggle();
    });
    // $("body").on("click" ,'.open-choose', function (event) {
    //   event.preventDefault();
    //   $(".choose").slideToggle()
    //   // $( "#choose" ).addClass( "choose" )

    // })

    $(".switch").on("click", ".slider", function () {
      var then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });

    // close
    $("body").on("click", ".choose .close", function () {
      $(".choose").slideUp();
    });

    $("#close-add-area").on("click", function () {
      $("#add-man").removeClass("open-view-vindor-types");
    });

    $("#close-edit-area").on("click", function () {
      $("#edit-man").removeClass("open-view-vindor-types");
    });

    $("#close-vindors4").on("click", function () {
      $("#view-man").removeClass("open-view-vindor-types");
    });

    $(document).mouseup(function (e) {
      var container = $(".choose");

      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.slideUp();
      }
    });
    this.addStaff = new FormGroup({
      name: new FormControl(this.newDeliverer.name, [
        Validators.required,
        Validators.minLength(3),
      ]),
      phone: new FormControl(this.newDeliverer.phone, [
        Validators.required,
        // Validators.minLength(11),
        // Validators.pattern(/[0-9]+/),
      ]),
      email: new FormControl(this.newDeliverer.email, [
        // Validators.required,
        Validators.email,
      ]),
      password: new FormControl(this.newDeliverer.password, [
        Validators.required,
        Validators.minLength(8),
      ]),
      birthdate: new FormControl(this.newDeliverer.birthdate, [
        Validators.required,
      ]),
      address: new FormControl(this.newDeliverer.address, [
        Validators.required,
      ]),
      unique_id: new FormControl(this.newDeliverer.unique_id, [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14),
      ]),
      city_id: new FormControl(this.newDeliverer.city_id, [
        Validators.required,
      ]),
      area_id: new FormControl(this.newDeliverer.area_id, [
        Validators.required,
      ]),
      // name: new FormControl(this.newDeliverer.name, Validators.required)
    });

    this.getConfig();

    // this.editStaff = new FormGroup({
    //   name: new FormControl(this.editUser.name,
    //     [
    //       Validators.required,
    //       Validators.minLength(3),

    //      ] ),
    //      phone: new FormControl(this.editUser.phone,
    //       [
    //         Validators.required,
    //         Validators.minLength(11),
    //         //  Validators.pattern[0-9], fix it soon
    //        ]),
    //        email: new FormControl(this.editUser.email,
    //         [
    //           Validators.required,
    //           Validators.email,

    //          ]),
    //          password: new FormControl(this.editUser.password,
    //           [
    //             Validators.required,
    //             Validators.minLength(8),

    //            ]),
    //            birthdate: new FormControl(this.editUser.birthdate,
    //             [
    //               Validators.required,
    //              ]),
    //              address: new FormControl(this.editUser.address,
    //               [
    //                 Validators.required,
    //               ]),
    //               unique_id: new FormControl(this.editUser.unique_id,
    //               [
    //                 Validators.required,
    //               ]),
    //               city_id: new FormControl(this.editUser.city_id,
    //               [
    //                 Validators.required,
    //               ]),
    //               area_id: new FormControl(this.editUser.area_id,
    //               [
    //                 Validators.required,
    //               ]),
    // })

    this.token = this.auth.getToken();

    this.exportUrl =
      environment.api + "/api" + "/admin/deliverers/export?token=" + this.token;

    this.loadDeliverers();
    this.loadCities();
  }

  loadCities() {
    this.areaService.getCities().subscribe((response: any) => {
      this.cities = response.data;
    });
  }

  loadDeliverers() {
    this.deliverService.getDeliverers({}).subscribe((response: any) => {
      this.deliverers = response.data;

      this.deliverers.map((user: any) => {
        let birthdate = new Date(user.birthdate);
        user.age = this.calculateAge(birthdate);
        user.deactivated = !user.active;
        return user;
      });
    });
  }

  toggeldelivary(newDeliverer) {
    newDeliverer.showDelivere = !newDeliverer.showDelivere;
  }
  createDeliverer(deliverer) {
    if (!this.addStaff.valid && !deliverer.image) {
      this.markFormGroupTouched(this.addStaff);
      this.showError = 1;
      return;
    }
    //  if(!deliverer.image) {
    //       this.showError = 1;
    //       return;
    //     }

    this.deliverService
      .createDeliverer(deliverer)
      .subscribe((response: any) => {
        if (response.code == 200) {
          this.deliverers.push(response.data);

          $("#add-man").toggleClass("open-view-vindor-types");
        } else {
          this.toastrService.error(response.message);
        }
      });
  }

  viewDeliverer(user) {
    $("#view-man").toggleClass("open-view-vindor-types");
    this.currentUser = user;
  }

  editDeliverer(user) {
    this.editUser = JSON.parse(JSON.stringify(user));
    this.editUser.unique_id = user.delivererProfile.unique_id;
    this.editUser.area_id = user.delivererProfile.area.id;
    this.editUser.image = user.delivererProfile.image;
    this.editUser.imageUrl = user.delivererProfile.image;
    this.editUser.birthdate = new Date(user.birthdate);
    this.city_id = user.delivererProfile.area.city_id;

    this.loadAreas(this.city_id);
    $("#edit-man").toggleClass("open-view-vindor-types");
  }

  updateDeliverer(user) {
    this.deliverService
      .updateDeliverer(user.id, user)
      .subscribe((response: any) => {
        if (response.code == 200) {
          let ind = this.deliverers.findIndex((item) => {
            return item.id == user.id;
          });
          if (ind !== -1) {
            this.deliverers[ind] = response.data;
          }

          this.currentUser = response.data;

          $("#edit-man").toggleClass("open-view-vindor-types");
        } else {
          this.toastrService.error(response.message);
        }
      });
  }

  toggleShow() {
    this.show = !this.show;
    this.hide = !this.hide;
  }

  calculateAge(birthday) {
    // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  changeActive(user) {
    this.deliverers
      .filter((user) => {
        return user.showReason;
      })
      .map((user) => {
        if (user.active == user.deactivated) {
          user.active = !user.active;
        }
        user.showReason = 0;
        return user;
      });

    if (user.active) {
      // currently checked
      user.showReason = 0;
      user.notes = "";
      if (user.deactivated) {
        this.deliverService
          .activateDeliverer(user.id)
          .subscribe((data: any) => {
            user.active = 1;
            user.notes = "";
            user.deactivation_notes = "";
            user.deactivated = 0;
          });
      }
    } else {
      user.notes = user.deactivation_notes;
      user.showReason = 1;
    }
  }

  cancelDeactivate(user) {
    user.active = 1;
    user.notes = "";
    user.showReason = 0;
  }

  submitDeactivate(user) {
    user.active = 0;
    this.deliverService
      .deactivateDeliverer(user.id, { deactivation_notes: user.notes })
      .subscribe((data: any) => {
        user.active = 0;
        user.deactivation_notes = user.notes;
        user.showReason = 0;
        user.deactivated = 1;
      });
  }

  loadAreas(city_id) {
    let city = this.cities.find((item) => {
      return item.id == city_id;
    });

    if (city) this.area_list = city.areas;
  }

  removeImage(deliverer) {
    deliverer.image = "";
    deliverer.imageUrl = "";
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
