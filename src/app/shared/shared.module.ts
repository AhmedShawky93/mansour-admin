import { SummaryPipe } from "./summary.pipe";
import { ButtonSpinnerDirective } from "./directives/button-spinner.directive";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [ButtonSpinnerDirective, SummaryPipe],
  imports: [],
  exports: [ButtonSpinnerDirective, SummaryPipe],
})
export class SharedModule {}
