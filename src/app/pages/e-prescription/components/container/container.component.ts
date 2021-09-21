import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  public sideBarAction: any;
  selectedItem: any;
  currentOperation: string;

  constructor() {
    this.sideBarAction = {show: false, title: 'Preview'};
  }

  ngOnInit() {
  }

  openSideBar(title) {
    this.sideBarAction['show'] = true;
    this.sideBarAction['title'] = title;
    this.sideBarAction = {...this.sideBarAction};
  }

  closeSideBar() {
    this.sideBarAction['show'] = false;
    this.sideBarAction['title'] = '';
    this.sideBarAction = {...this.sideBarAction};
  }
  operations(data) {
    this.currentOperation = data.operation;
    switch (data.operation) {
      case 'view':
        this.viewOperation(data.data);
        break;
    }
  }

  viewOperation(data) {
    this.selectedItem = {...data};
    this.openSideBar(data.name);
  }
}
