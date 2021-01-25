import {FormGroup} from '@angular/forms';

export function DateLessThan(from: string, to: string) {
  return (group: FormGroup): {[key: string]: any} => {
    const f = group.controls[from];
    const t = group.controls[to];
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
    }
    return {};
  };
}
