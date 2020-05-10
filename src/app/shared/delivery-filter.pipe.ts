import { Pipe, PipeTransform } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { pipe } from '@angular/core/src/render3/pipe';

@Pipe({
  name: 'deliveryFilter',

})

export class DeliveryFilterPipe implements PipeTransform {

  transform(items: any, term): any {

    if (typeof term !== "undefined" && term != "") {
      return items.filter(item => {
        let districts = item.deliverer_profile.districts.map(d => d.name).join(" ");
        return item.name.toLowerCase().includes(term.toLowerCase()) || districts.toLowerCase().includes(term.toLowerCase());
      });

    } else {
      return items;
    }
  }
}
