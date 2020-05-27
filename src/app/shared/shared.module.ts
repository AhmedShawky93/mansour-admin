import { SummaryPipe } from "./summary.pipe";
import { ButtonSpinnerDirective } from "./directives/button-spinner.directive";
import { NgModule } from "@angular/core";
import { StringFilterPipe } from "./string-filter.pipe";

@NgModule({
  declarations: [ButtonSpinnerDirective, SummaryPipe, StringFilterPipe],
  imports: [],
  exports: [ButtonSpinnerDirective, SummaryPipe, StringFilterPipe],
})
export class SharedModule {}
