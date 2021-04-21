import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import * as moment from 'moment';

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

  formatDate(data) {
    const formControl = this.myForm.get(this.formControlChildName);
    const currentDate = (formControl.value) ? formControl.value : data.target.value;
    const taskDueDate = moment(currentDate, 'DD-MM-YYYY');
    const format = moment(taskDueDate['_d']).format('YYYY-MM-DD');
    formControl.setValue(format);
  }
}
