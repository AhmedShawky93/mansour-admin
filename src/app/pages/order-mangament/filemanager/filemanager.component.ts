import {
  Component,
  OnInit,
} from "@angular/core";

import {
  ConfigInterface,
  TreeModel,
} from "ng6-file-man";

import { environment } from "@env/environment";

const treeConfig: ConfigInterface = {
  baseURL: environment.api,
  api: {
    listFile: '/api/admin/file/list',
    uploadFile: '/api/admin/file/upload',
    downloadFile: '/api/admin/file/download',
    deleteFile: '/api/admin/file/remove',
    createFolder: '/api/admin/file/directory',
    renameFile: '/api/admin/file/rename',
    searchFiles: '/api/admin/file/search'
  },
  options: {
    allowFolderDownload: null,
    showFilesInsideTree: false
  }
};

@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.css']
})
export class FilemanagerComponent implements OnInit {
  tree;
  constructor() {
    this.tree = new TreeModel(treeConfig)
  }

  ngOnInit() {
  }

}
