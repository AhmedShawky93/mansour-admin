import {
  Pipe,
  PipeTransform,
} from "@angular/core";

@Pipe({
  name: 'rewardsFilter',
  
})

export class SearchRewardsPipe implements PipeTransform {

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
