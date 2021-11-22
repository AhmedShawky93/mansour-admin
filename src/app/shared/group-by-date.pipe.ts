import { Pipe, PipeTransform } from "@angular/core";

import * as moment from "moment";

@Pipe({
  name: "groupBy",
})
export class GroupByDatePipe implements PipeTransform {
  transform(collection, property: string) {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[moment(current[property]).format("YYYY-MM-DD")]) {
        previous[moment(current[property]).format("YYYY-MM-DD")] = [current];
      } else {
        previous[moment(current[property]).format("YYYY-MM-DD")].push(current);
      }

      return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map((key) => ({
      key,
      value: groupedCollection[key],
    }));
  }
}
