import { SummaryPipe } from './summary.pipe';
import { ButtonSpinnerDirective } from './directives/button-spinner.directive';
import { NgModule } from '@angular/core';
import { StringFilterPipe } from './string-filter.pipe';
import {ImageUploaderComponent} from '@app/shared/components/image-uploader/image-uploader.component';
import { GenericDatePickerComponent } from './components/generic-date-picker/generic-date-picker.component';
import { GenericTimePickerComponent } from './components/generic-time-picker/generic-time-picker.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SatDatepickerModule} from 'saturn-datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    ButtonSpinnerDirective,
    SummaryPipe,
    StringFilterPipe,
    ImageUploaderComponent,
    GenericDatePickerComponent,
    GenericTimePickerComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SatDatepickerModule,
    NgxMaterialTimepickerModule
  ],
  exports: [
    ButtonSpinnerDirective,
    SummaryPipe,
    StringFilterPipe,
    ImageUploaderComponent,
    GenericDatePickerComponent,
    GenericTimePickerComponent
  ],
})
export class SharedModule {}
