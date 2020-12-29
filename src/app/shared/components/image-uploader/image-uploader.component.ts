import {Component, EventEmitter, Input, Output, OnInit, OnChanges} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {UploadFilesService} from '@app/pages/services/upload-files.service';
import { FormGroup } from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit, OnChanges {
  @Input() myForm: FormGroup;
  @Input() formControlChildName: string;
  @Input() fileUrl;
  @Input() height: string;
  @Input() width: string;
  @Output() uploadedImageUrl = new EventEmitter();

  imageUrl: string;
  isPdf: boolean;
  trustedUrl: SafeUrl;
  loading: boolean;
  reader: FileReader = new FileReader();
  fallbackImage: string;
  selectFile: any;

  constructor(
    private sanitizer: DomSanitizer,
    private uploadFile: UploadFilesService,
    private toasterService: ToastrService
  ) {
    this.fallbackImage = 'http://via.placeholder.com/370x220';
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges() {
    this.loadData();
  }

  loadData() {
    this.imageUrl = this.fileUrl;
    this.checkUrlType();
  }

  checkUrlType() {
    if (this.imageUrl) {
      const pdf = this.imageUrl.substring(this.imageUrl.length - 3, this.imageUrl.length);
      this.isPdf = (pdf === 'pdf') ? true : false;
    }
  }

  trustURL(url) {
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    return this.trustedUrl;
  }

  onImageSelected(event) {
    if (event.target.value) {
      this.loading = true;
      this.selectFile = <File>event.target.files[0];
      const typeImage = this.selectFile.type.split('/')[0];
      const typePdf = this.selectFile.type.split('/')[1];
      if (typeImage === 'image' || typePdf === 'pdf') {
        this.reader.readAsDataURL(event.target.files[0]);
        this.reader.onload = (_event) => {
          this.imageUrl = this.reader.result;
        };
        this.uploadFile.uploadFile(this.selectFile)
          .subscribe(
            (response: any) => {
              if (response.body) {
                this.imageUrl = response.body.data.filePath;
                this.checkUrlType();
                this.myForm.controls[this.formControlChildName].setValue(this.imageUrl);
                /*this.myForm.value[this.formControlChildName] = this.imageUrl;*/
                this.uploadedImageUrl.emit(this.imageUrl);
              }
            },
            error => {
              console.error(error);
              this.loading = false;
            },
            () => {
              this.loading = false;
            }
          );
      } else {
        this.loading = false;
        this.toasterService.error('Please Choose Image File');
        this.selectFile = null;
      }

    }
  }

}
