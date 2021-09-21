import {Component, Input, OnInit, OnChanges} from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit, OnChanges {
  @Input() selectedItem;

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(): void {
  }
}
