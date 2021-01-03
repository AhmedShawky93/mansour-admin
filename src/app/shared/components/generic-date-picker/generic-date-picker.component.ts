import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-generic-date-picker',
  templateUrl: './generic-date-picker.component.html',
  styleUrls: ['./generic-date-picker.component.css']
})
export class GenericDatePickerComponent implements OnInit {
  @Input() placeholder: string;
  @Input() label: string;
  @Input() myForm: FormGroup;
  @Input() formControlChildName: string;
  constructor() { }

  ngOnInit() {
  }

}
