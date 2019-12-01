import { Pipe, PipeTransform } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { pipe } from '@angular/core/src/render3/pipe';

@Pipe({
  name: 'stringFilter',
  
})

export class StringFilterPipe implements PipeTransform {

  transform(items: any, term): any {

    if (typeof term !== "undefined" && term != "") {
      return items.filter(item => {
        return item.name.toLowerCase().includes(term.toLowerCase());
      });
     
    } else {
      return items;
    }
  }
  

}
