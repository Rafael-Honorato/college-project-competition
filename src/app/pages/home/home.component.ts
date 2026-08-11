import { Component, inject, OnInit } from '@angular/core';
import { CompetitionsService } from '../../core/services/competitions.service';
import { Competitions } from '../../core/interfaces/competitions';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [CompetitionsService],
})
export class HomeComponent {
  // compService = inject(CompetitionsService);
  // ngOnInit(): void {
  //   this.compService.getAll().subscribe({
  //     next: (c) => console.log(c),
  //     error: (err) => console.log(err),
  //   });
  // }
}
