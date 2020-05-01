import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-view-order-states',
  templateUrl: './view-order-states.component.html',
  styleUrls: ['./view-order-states.component.css']
})
export class ViewOrderStatesComponent implements OnInit {
  @Output() closeSideBarEmit = new EventEmitter();
  @Output() dataEmit = new EventEmitter();
  @Input("selectDataEdit") dataView;
  constructor() {}

  ngOnInit() {
    console.log(this.dataView)
  }

  closeSideBar() {
    this.closeSideBarEmit.emit();
  }

}
