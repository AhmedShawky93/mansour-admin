import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  filesToUpload: Array<File> = [];

  private url: any;

  constructor(private http: HttpClient) {
    this.url = environment.api + '/admin';
  }

  getUploadedFiles(page = 1) {
    return this.http.get(this.url + '/uploads?page=' + page);
  }

  uploadFile(file) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post(this.url + '/upload', fd, {
      reportProgress: true,
      observe: 'events'
    })
      .catch((error: any) => {
        return Observable.throw(error.error || 'file upload error');
      });
  }

  uploadFiles(files) {
    const formData: any = new FormData();
    console.log(files);

    for (let i = 0; i < files.length; i++) {
      formData.append('files[]', files[i], files[i]['name']);
    }

    console.log('form data variable :   ' + formData.toString());
    return this.http.post(this.url + '/upload_files', formData);
  }
}
