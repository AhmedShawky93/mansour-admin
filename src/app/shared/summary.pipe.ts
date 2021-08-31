import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'summary'
})

export class SummaryPipe implements PipeTransform {
    transform(value: string, limit?: number) {
        if (value.length >= 20) {
            const actualLimie = (limit) ? limit : 50;
            return value.substr(0, actualLimie) + '...';

        } else {
            return value;

        }

    }
}

