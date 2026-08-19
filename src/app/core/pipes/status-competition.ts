import { Pipe, PipeTransform } from '@angular/core';
import { COMPETITION_STATUS } from '../constants/competitions';
@Pipe({
  name: 'competitionStatus',
  standalone: true,
})
export class StatusCompetitionPipe implements PipeTransform {
  transform(value: string, ...args: any[]) {
    return (
      COMPETITION_STATUS[value as keyof typeof COMPETITION_STATUS] ?? value
    );
  }
}
