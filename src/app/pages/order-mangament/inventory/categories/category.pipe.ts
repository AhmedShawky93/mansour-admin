import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

@Pipe({
    name: 'categoryFilter',
})
export class CategoryPipe implements PipeTransform {

    transform(items: any, term): any {

        if (typeof term !== "undefined" && term != "") {
            return items.filter(item => {
                let sub_categories = item.sub_categories;
                sub_categories = sub_categories.filter(sub => sub.name.toLowerCase().includes(term.toLowerCase()))
                return item.name.toLowerCase().includes(term.toLowerCase()) || sub_categories.length;
            });
            
        } else {
            return items;
        }
    }
}