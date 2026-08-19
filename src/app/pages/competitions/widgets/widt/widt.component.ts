import { Component, inject, OnInit, signal } from '@angular/core';
import { CompetitionsService } from '../../../../core/services/competitions.service';
import { Competitions } from '../../../../core/interfaces/competitions';
import { CommonModule } from '@angular/common';
import { map, Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-widt',
  imports: [CommonModule],
  templateUrl: './widt.component.html',
  styleUrl: './widt.component.css',
  providers: [CompetitionsService],
})
export class WidtComponent implements OnInit {
  compService = inject(CompetitionsService);
  diasRestantes = signal('');
  media!: Observable<number>;

  ngOnInit(): void {
    this.media = this.compService.getAll().pipe(
      map((competitions: Competitions[]) => {
        const daysLeftList = competitions.map((comp) =>
          this.calculateDaysLeft(comp.startDate, comp.endDate),
        );

        const average =
          daysLeftList.reduce((acc, days) => acc + days, 0) /
          daysLeftList.length;

        return average;
      }),
    );
  }

  private calculateDaysLeft(startDate: string, endDate: string): number {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffMs = end - start;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }
}
