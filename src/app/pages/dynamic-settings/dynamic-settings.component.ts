import {AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UploadFilesService} from '@app/pages/services/upload-files.service';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {SettingService} from '@app/pages/services/setting.service';
import {Observable} from 'rxjs/Observable';
import {ToastrService} from 'ngx-toastr';
import {ReactivityService} from '@app/shared/services/reactivity.service';


@Component({
  selector: 'app-dynamic-settings',
  templateUrl: './dynamic-settings.component.html',
  styleUrls: ['./dynamic-settings.component.css']
})
export class DynamicSettingsComponent implements OnInit, AfterViewInit, AfterContentChecked {
  settings: any;
  settings$: Observable<any>;
  settingGroups: Array<any>;
  componentForm: FormGroup;
  formGroups: Array<any>;
  reader: FileReader = new FileReader();
  file_Url: any;
  fileUploading: boolean;
  submitting: boolean;
  editorConfig: AngularEditorConfig;

  constructor(
    private formBuilder: FormBuilder,
    private uploadFilesService: UploadFilesService,
    private settingService: SettingService,
    private toasterService: ToastrService,
    private reactivityService: ReactivityService,
    private cdRef: ChangeDetectorRef
  ) {
    this.settings$ = this.settingService.getSettings();
    this.formGroups = [];
    this.fileUploading = false;
    this.submitting = false;
    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: '177px',
      minHeight: '5rem',
      placeholder: 'Enter text here...',
      translate: 'no',
      uploadUrl: 'v1/images', // if needed
      customClasses: [ // optional
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ]
    };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadData();
    });
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  loadData() {
    this.getSettings();
  }

  getSettings() {
    this.settings$.subscribe(
      (res: any) => {
        if (res.code === 200) {
          this.settings = res.data;
          this.createDynamicForm();
        }
      }
    );
  }

  createDynamicForm() {
    this.componentForm = this.formBuilder.group(this.createMainGroupsControls());

  }

  createMainGroupsControls() {
    /*get main groups*/
    this.settingGroups = Object.keys(this.settings);
    const mainGroups: Object = {};

    /*loop over groups to create groups as form array*/
    this.settingGroups.forEach(key => {
      const value = this.settings[key];

      /*groups as form array*/
      mainGroups[key] = this.formBuilder.array([]);

      /*set title & name to use it later on template*/
      mainGroups[key]['name'] = key;
      mainGroups[key]['title'] = key.replaceAll('_', ' ');

      /*loop over it to create form groups with controls inside current form array*/
      value.forEach((data: Array<any>) => {
        mainGroups[key].push(this.createFromGroup(data));
      });

      /*push forms arrays [formgroups] to array to use it on template*/
      this.formGroups.push(mainGroups[key]);
    });

    return mainGroups;
  }

  createFromGroup(data): FormGroup {
    return this.formBuilder.group({
      id: new FormControl(data ? data.id : ''),
      order: new FormControl(data ? data.order : ''),
      type: new FormControl(data ? data.type : ''),
      name: new FormControl(data ? data.name : ''),
      value: new FormControl(data ? data.value : ''),
      options: new FormControl(data ? data.options : ''),
      group: new FormControl(data ? data.group : ''),
      slug: new FormControl(data ? data.slug : ''),
      description: new FormControl(data ? data.description : ''),
    });
  }

  setColor(color: any, colorFormControl: FormControl) {
    colorFormControl.setValue(color);
  }

  uploadFile(event, group: FormGroup) {
    this.fileUploading = true;
    if (event.target.value) {
      const selectFile = <File>event.target.files[0];
      this.reader.readAsDataURL(event.target.files[0]);
      this.reader.onload = (_event) => {
        this.file_Url = this.reader.result;
      };
      this.uploadFilesService.uploadFile(selectFile)
        .subscribe(
          (response: any) => {
            if (response.body) {
              this.file_Url = response.body.data.filePath;
              group.controls.value.setValue(this.file_Url);
              this.fileUploading = false;
            }
          },
          error => {
            console.error(error);
            this.fileUploading = false;
          },
          () => {
          }
        );
    }
  }

  mappingData() {
    let data = [];

    Object.keys(this.componentForm.value).forEach(key => {
      const values = this.componentForm.value[key];
      data.push(...values);
    });


    data = data.map(item => {
      return {id: item.id, name: item.name, value: item.value};
    }).filter(obj => {
      if (obj.value !== null) {
        return obj;
      }
    });

    return data;
  }

  saveDataToStore(data) {
    this.reactivityService.setDataToStore('globalSettings', data);
    localStorage.setItem('globalSettings', JSON.stringify(data));
  }

  save() {
    this.settingService.updateDynamicSettings(this.mappingData())
      .subscribe(
        (res: any) => {
          if (res.code === 200) {
            this.saveDataToStore(res.data);
            this.toasterService.success('Updated Successfully');
          } else {
            this.toasterService.error(res.message);
          }
        }
      );
  }
}
