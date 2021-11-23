import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "deliveredPipe",
})
export class DeliveredPipe implements PipeTransform {
  transform(items: any, term): any {
    if (term) {
      return items.filter((item) => {
        return !item.status;
      });
    } else {
      return items;
    }
  }
}
