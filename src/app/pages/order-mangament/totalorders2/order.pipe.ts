import {
  Pipe,
  PipeTransform,
} from "@angular/core";

@Pipe({
  name: 'orderFilter',
})
export class OrderFilterPipe implements PipeTransform {

  transform(items: any, term): any {

    if (typeof term !== "undefined" && term != "") {
      return items.filter(item => {
        return item.id == term || item.user.name.toLowerCase().includes(term.toLowerCase());
      });
     
    } else {
      return items;
    }
  }
  

}
