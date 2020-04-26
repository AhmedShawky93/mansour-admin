import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe',
})
export class SearchPipe implements PipeTransform {

  transform(items: any, term): any {

    if (typeof term !== "undefined" && term != "") {
      return items.filter(item => {
        return item.reward.name.toLowerCase().includes(term.toLowerCase()) || item.user.name.toLowerCase().includes(term.toLowerCase()) || item.user.phone.toLowerCase().includes(term.toLowerCase());
      });
     
    } else {
      return items;
    }
  }
}
