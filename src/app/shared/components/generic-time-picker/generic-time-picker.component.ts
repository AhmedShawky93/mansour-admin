import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-generic-time-picker',
  templateUrl: './generic-time-picker.component.html',
  styleUrls: ['./generic-time-picker.component.css']
})
export class GenericTimePickerComponent implements OnInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() myForm: FormGroup;
  @Input() formControlChildName: string;
  constructor() { }

  ngOnInit() {
  }

}
