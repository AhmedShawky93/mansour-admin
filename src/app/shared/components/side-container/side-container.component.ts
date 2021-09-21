import {Component, Input, OnInit, OnChanges, Output, EventEmitter} from '@angular/core';
import {trigger, state, style, transition, animate, } from '@angular/animations';

@Component({
  selector: 'app-side-container',
  templateUrl: './side-container.component.html',
  styleUrls: ['./side-container.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translate3d(0px, 0, 0)',
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(-100%, 0, 0)',
        })
      ),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out')),
    ]),
  ],

})
export class SideContainerComponent implements OnInit, OnChanges {

  @Input() sideContainerProp: any;

  animationStyle: string;
  title: string;
  constructor() {
    this.animationStyle = 'out';
  }

  ngOnInit() {
  }
  ngOnChanges(changes: any) {
    this.setStyleOnAction();
  }

  closeSideBar() {
    this.animationStyle = 'out';
  }

  setStyleOnAction() {
    this.animationStyle = this.sideContainerProp.show ? 'in' : 'out';
  }
}
