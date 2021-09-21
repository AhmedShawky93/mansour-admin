import {
  Pipe,
  PipeTransform,
} from "@angular/core";

@Pipe({
  name: 'stringFilter',

})

export class StringFilterPipe implements PipeTransform {

  transform(items: any, term): any {

    if (typeof term !== 'undefined' && term != '') {
      return items.filter(item => {

        return (item.name)
          ? item.name.toLowerCase().includes(term.toLowerCase())
          : item.name_en.toLowerCase().includes(term.toLowerCase());
      });
    } else {
      return items;
    }
  }


}
