import { Pipe, PipeTransform } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { pipe } from '@angular/core/src/render3/pipe';

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
