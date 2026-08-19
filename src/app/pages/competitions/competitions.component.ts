import { Component, inject, OnInit } from '@angular/core';
import { CompetitionsService } from '../../core/services/competitions.service';
import { Competitions } from '../../core/interfaces/competitions';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WidtComponent } from './widgets/widt/widt.component';
import { COMPETITION_STATUS } from '../../core/constants/competitions';
import { StatusCompetitionPipe } from '../../core/pipes/status-competition';

@Component({
  selector: 'app-competitions',
  imports: [CommonModule, WidtComponent, StatusCompetitionPipe],
  templateUrl: './competitions.component.html',
  styleUrl: './competitions.component.css',
  providers: [CompetitionsService],
})
export class CompetitionsComponent {
  router = inject(Router);
  compService = inject(CompetitionsService);
  competitions: Competitions[] = [];

  onEdit(id: number) {
    this.router.navigate(['competition', 'detail', id]);
  }
  onCreate() {
    this.router.navigate(['competition', 'create']);
  }

  onDelete(id: number, title: string) {
    const confirm = window.confirm(`Tem certeza que quer exluir ${title}?`);

    if (confirm) {
      this.compService.delete(+id).subscribe({
        next: (comp) => console.log(comp),
        error: (err) => console.log(err),
      });
    }
  }

  statusLabel(status: keyof typeof COMPETITION_STATUS | string): string {
    return (
      COMPETITION_STATUS[status as keyof typeof COMPETITION_STATUS] ??
      'Status desconhecido'
    );
  }
}
