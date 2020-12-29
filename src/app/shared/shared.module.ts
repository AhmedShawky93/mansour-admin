import { SummaryPipe } from './summary.pipe';
import { ButtonSpinnerDirective } from './directives/button-spinner.directive';
import { NgModule } from '@angular/core';
import { StringFilterPipe } from './string-filter.pipe';
import {ImageUploaderComponent} from '@app/shared/components/image-uploader/image-uploader.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [ButtonSpinnerDirective, SummaryPipe, StringFilterPipe, ImageUploaderComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [ButtonSpinnerDirective, SummaryPipe, StringFilterPipe, ImageUploaderComponent],
})
export class SharedModule {}
