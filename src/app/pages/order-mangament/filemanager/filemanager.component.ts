import {
  Component,
  OnInit,
} from "@angular/core";

import {
  ConfigInterface,
  TreeModel,
} from "ng6-file-man";

const treeConfig: ConfigInterface = {
  baseURL: 'http://localhost:8080/',
  api: {
    listFile: 'api/file/list',
    uploadFile: 'api/file/upload',
    downloadFile: 'api/file/download',
    deleteFile: 'api/file/remove',
    createFolder: 'api/file/directory',
    renameFile: 'api/file/rename',
    searchFiles: 'api/file/search'
  },
  options: {
    allowFolderDownload: false,
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
