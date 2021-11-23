import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "productFilter",
})
export class ProductFilterPipe implements PipeTransform {
  transform(items: any, term): any {
    if (typeof term !== "undefined" && term != "") {
      return items.filter((item) => {
        return (
          item.name.toLowerCase().includes(term.toLowerCase()) ||
          item.sku.toLowerCase().includes(term.toLowerCase())
        );
      });
    } else {
      return items;
    }
  }
}
