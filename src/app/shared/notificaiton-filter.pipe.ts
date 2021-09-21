import {
  Pipe,
  PipeTransform,
} from "@angular/core";

@Pipe({
  name: 'notificationFilter',
})

export class NotificationFilterPipe implements PipeTransform {

  transform(items: any, term): any {
    if (typeof term !== "undefined" && term != "") {
      return items.filter(item => {
        return item.body.toLowerCase().includes(term.toLowerCase()) || item.title.toLowerCase().includes(term.toLowerCase());
      });
         
    // }else  if (typeof term !== "undefined" && term != "") {
    // return title.filter(item => {
    //     return item.title.toLowerCase().includes(term.toLowerCase());
    // });
           
    }else {
      return items;
    }
  }
  

}
