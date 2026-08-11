import { Component, inject, OnInit } from '@angular/core';
import { CompetitionsService } from '../../core/services/competitions.service';
import { Competitions } from '../../core/interfaces/competitions';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { of, shareReplay } from 'rxjs';
import { WidtComponent } from './widgets/widt/widt.component';

@Component({
  selector: 'app-competitions',
  imports: [CommonModule, WidtComponent],
  templateUrl: './competitions.component.html',
  styleUrl: './competitions.component.css',
  providers: [CompetitionsService],
})
export class CompetitionsComponent {
  router = inject(Router);
  compService = inject(CompetitionsService);
  competitions: Competitions[] = [];

  onEdit(id: number) {
    this.router.navigate(['competition/detail', id]);
  }
}
