import {FormGroup} from '@angular/forms';

export function DateLessThan(from: string, to: string, timeFrom: string, timeTo: string) {
  return (group: FormGroup): {[key: string]: any} => {
    let f = group.controls[from];
    let t = group.controls[to];
    if (group.controls[timeFrom] && group.controls[timeFrom].value && f.value){
      const timeArrayFrom = group.controls[timeFrom].value.split(':');
      if (typeof f.value == 'string'){
        f.value == `${f.value} ${timeArrayFrom[0]}:${timeArrayFrom[1]}:00`;
      }else{
        f.value.setHours(timeArrayFrom[0], timeArrayFrom[1]);
      }
    }
    if (group.controls[timeTo] && group.controls[timeTo].value && t.value){
      const timeArrayTo = group.controls[timeTo].value.split(':');
      if (typeof t.value == 'string') {
        t.value == `${t.value} ${timeArrayTo[0]}:${timeArrayTo[1]}:00`;
      } else {
        t.value.setHours(timeArrayTo[0], timeArrayTo[1]);
      }
    }
    if (f.value && t.value) {
      if (f.value > t.value) {
        t.setErrors({'dateRang': true});
        f.setErrors({'dateRang': true});
        return {
          dates: 'Date from should be less than Date to'
        };
      } else if (f.value < t.value) {
        t.setErrors(null);
        f.setErrors(null);
        return {};
      }
    }else{
      t.setErrors(null);
      f.setErrors(null);
    }
    return {};
  };
}

export function compareNumbers(from: string, to: string) {
  return (group: FormGroup): {[key: string]: any} => {
    const f = group.controls[from];
    const t = group.controls[to];
    if (f.value && t.value) {
      if (f.value > t.value) {
        t.setErrors({'lessThan': true});
        f.setErrors({'lessThan': true});
        return {
          compare: `${from} Must Be Less Than ${to}`
        };
      } else if (f.value < t.value) {
        t.setErrors(null);
        f.setErrors(null);
        return {};
      }
    }
    return {};
  };
}

