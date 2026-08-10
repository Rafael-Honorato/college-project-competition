import { Component, inject, OnInit } from '@angular/core';
import { CompetitionsService } from '../../core/services/competitions.service';
import { Competitions } from '../../core/interfaces/competitions';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-competitions',
  imports: [CommonModule],
  templateUrl: './competitions.component.html',
  styleUrl: './competitions.component.css',
})
export class CompetitionsComponent implements OnInit {
  router = inject(Router);
  compService = inject(CompetitionsService);
  competitions: Competitions[] = [];

  ngOnInit(): void {
    this.compService.getAll().subscribe({
      next: (c) => (this.competitions = c),
      error: (err) => console.log(err),
    });
  }

  onEdit(id: number) {
    this.router.navigate(['competition/detail', id]);
  }
}
