import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

import { ConfigInterface, TreeModel } from "ng6-file-man";
import { Subscription } from "rxjs";

import { PagesService } from "@app/pages/services/pages.service";
import { environment } from "@env/environment";

var treeConfig: ConfigInterface = {
  baseURL: environment.api,
  api: {
    listFile: "/api/admin/file/list",
    uploadFile: "/api/admin/file/upload",
    downloadFile: "/api/admin/file/download",
    deleteFile: "/api/admin/file/remove",
    createFolder: "/api/admin/file/directory",
    renameFile: "/api/admin/file/rename",
    searchFiles: "/api/admin/file/search",
  },
  options: {
    allowFolderDownload: null,
    showFilesInsideTree: false,
  },
};

@Component({
  selector: "app-filemanager",
  templateUrl: "./filemanager.component.html",
  styleUrls: ["./filemanager.component.css"],
})
export class FilemanagerComponent implements OnInit {
  tree;
  currentImg = "";
  uploaders = [];
  page = 1;
  routerSubscription: Subscription;
  @Input() currentInputIndex;
  constructor(
    private pageServ: PagesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.route.snapshot.queryParams.page) {
      this.page = this.route.snapshot.queryParams.page;
      treeConfig.api.listFile = "/api/admin/file/list?page=" + this.page;
      console.log("treeConfig : ", treeConfig.api);

      this.tree = new TreeModel(treeConfig);
    } else {
      this.tree = new TreeModel(treeConfig);
    }
    this.routerSubscription = router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.route.snapshot.queryParams.page) {
          this.page = this.route.snapshot.queryParams.page;
          treeConfig.api.listFile = "/api/admin/file/list?page=" + this.page;
          console.log("treeConfig : ", treeConfig.api);

          this.tree = new TreeModel(treeConfig);
        } else {
          this.tree = new TreeModel(treeConfig);
        }
      }
    });
  }
  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  paginate(page) {
    this.page = page;
    this.router.navigate(["/pages/filemanager"], {
      queryParams: { page: this.page },
    });
  }
  onSelect(e) {
    if (e.node && !e.node.isFolder) {
      // if(e.node.pathToNode.split('.').pop()=='png' || e.node.pathToNode.split('.').pop()=='jpg' || e.node.pathToNode.split('.').pop()=='jpeg' || e.node.pathToNode.split('.').pop()=='gif'){
      this.currentImg = environment.api + "/storage" + e.node.pathToNode;
      // console.log("currentImg : ",this.currentImg);
      this.uploaders[this.currentInputIndex] = this.currentImg;
      this.setUploaders();
      // }
    }
  }
  setUploaders() {
    this.pageServ.setUploads(this.uploaders);
    // console.log("uploaders : ",this.uploaders);
  }
  getnodeImgById(node) {
    if (
      node.pathToNode.split(".").pop() == "png" ||
      node.pathToNode.split(".").pop() == "jpg" ||
      node.pathToNode.split(".").pop() == "jpeg" ||
      node.pathToNode.split(".").pop() == "gif"
    ) {
      return environment.api + "/storage" + node.pathToNode;
    } else if (node.pathToNode.split(".").pop() == "xlsx") {
      return "./../../../../assets/img/fileTypes/xls.png";
    } else if (node.pathToNode.split(".").pop() == "pdf") {
      return "./../../../../assets/img/fileTypes/pdf.png";
    } else if (node.pathToNode.split(".").pop() == "doc") {
      return "./../../../../assets/img/fileTypes/word.png";
    } else if (
      node.pathToNode.split(".").pop() == "mp3" ||
      node.pathToNode.split(".").pop() == "mp4" ||
      node.pathToNode.split(".").pop() == "wmv" ||
      node.pathToNode.split(".").pop() == "flv"
    ) {
      return "./../../../../assets/img/fileTypes/vedio.png";
    } else if (
      node.pathToNode.split(".").pop() == "gitignore" ||
      node.pathToNode.split(".").pop() == "zip" ||
      node.pathToNode.split(".").pop() == "readme" ||
      node.pathToNode.split(".").pop() == "txt" ||
      node.pathToNode.split(".").pop() == "text"
    ) {
      return "./../../../../assets/img/fileTypes/file.png";
    } else {
      return "./../../../../assets/img/fileTypes/folder.png";
    }
  }
}
