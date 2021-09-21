import {
  Pipe,
  PipeTransform,
} from "@angular/core";

@Pipe({
  name: 'deliveryFilter',

})

export class DeliveryFilterPipe implements PipeTransform {

  transform(items: any, term): any {

    if (typeof term !== "undefined" && term != "") {
      return items.filter(item => {
        if (item.deliverer_profile) {
          let filter = item.deliverer_profile.districts.findIndex(d => d.id == term);
          return filter !== -1;
        }
        return false;
        // let districts = item.deliverer_profile.districts.map(d => d.name).join(" ");
        // return item.name.toLowerCase().includes(term.toLowerCase()) || districts.toLowerCase().includes(term.toLowerCase());
      });

    } else {
      return items;
    }
  }
}
