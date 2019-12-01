import { Component, OnInit } from '@angular/core';
import { UploadFilesService } from '@app/pages/services/upload-files.service';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from '@app/pages/services/setting.service';
import { Conditional } from '@angular/compiler';
import { EventEmitter } from '@angular/core';

function currentPasswordValidator(group: AbstractControl) {
  if (group.get('password').value && !group.get('current_password').value) {
    return { currentPassword: true };
  }

  return null;
}


function confirmPasswordValidator(group: AbstractControl) {
  if (group.get('password').value && (group.get('confirmPassword').value !== group.get('password').value)) {
    return { confirmPassword: true };
  }
  return null;
}

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  page: any = 1;
  gallery: any;
  public errorMatch;
  selectFile = null;
  setting: any = [

  ];

  formSetting: FormGroup;
  user: any;
  users: any;
  requiredIf: boolean;
  selectedFiles: File[];

  constructor(
    private uploadFile: UploadFilesService,
    private toastrService: ToastrService,
    private settingService: SettingService,
  ) {


  }

  ngOnInit() {


    this.getUser();

    this.uploadFile.getUploadedFiles()
      .subscribe((response: any) => {
        this.gallery = response.data;
      });
  }

  loadMore() {
    this.page++;
    this.uploadFile.getUploadedFiles(this.page)
      .subscribe((response: any) => {
        this.gallery = this.gallery.concat(response.data);
        console.log(this.gallery);
      });
  }

  setForm(user) {
    this.formSetting = new FormGroup({
      image: new FormControl(user.image),
      name: new FormControl(user.name, [Validators.required, Validators.maxLength(20)]),
      email: new FormControl(user.email, Validators.required),
      current_password: new FormControl(''),
      password: new FormControl('', Validators.minLength(8)),
      confirmPassword: new FormControl(''),
    }, { validators: [currentPasswordValidator, confirmPasswordValidator] });
  }

  getUser() {
    this.settingService.getNotification()
      .subscribe((response: any) => {
        this.user = response.data;
        this.user.imageUrl = this.user.image;
        this.setForm(this.user);
      });
  }

  onimgeSelected(event, image) {
    this.selectFile = <File>event.target.files[0];
    this.uploadFile.uploadFile(this.selectFile)
      .subscribe((response: any) => {

        if (response.body) {
          this.user.image = response.body.data.name;
          this.user.imageUrl = response.body.data.filePath;
          image.setValue(response.body.data.filePath);
        }

      });
  }

  oniImageSelected(event) {
    this.selectedFiles = <Array<File>>event.target.files;

    this.uploadFile.uploadFiles(this.selectedFiles)
      .subscribe((response: any) => {

        this.gallery = this.gallery.concat(response.data);

      });
  }

  updateSetting(user) {

    console.log(this.formSetting);

    if (!this.formSetting.valid) {
      this.markFormGroupTouched(this.formSetting);
      return;
    }

    user = this.formSetting.value;

    if (this.user.imageUrl === '') {
      user.imageUrl = '';
      user.image = '';
    }

    this.settingService.updateNotification(user)
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.user = response.data;
          this.user.imageUrl = this.user.image;
          this.formSetting.reset();
          this.setForm(this.user);
          console.log('UPDATED');
          console.log(this.user);
          this.settingService.imageload(response.data);
          this.toastrService.success(response.message);
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
  deleteImage(img) {
    this.user.imageUrl = '';
    this.user.image = '';
  }

}
