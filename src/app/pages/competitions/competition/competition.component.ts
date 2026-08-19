import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionsService } from '../../../core/services/competitions.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { COMPETITION_STATUS_ENTRIES } from '../../../core/constants/competitions';

@Component({
  selector: 'app-competition',
  imports: [ReactiveFormsModule],
  templateUrl: './competition.component.html',
  styleUrl: './competition.component.css',
  providers: [CompetitionsService],
})
export class CompetitionComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  compService = inject(CompetitionsService);
  fb = inject(FormBuilder);
  readonly statusComp = COMPETITION_STATUS_ENTRIES;
  compId = signal('');

  formGroup: FormGroup = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    status: ['', Validators.required],
  });

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const compId = this.route.snapshot.paramMap.get('id');
    if (compId) {
      this.compId.set(compId);
      this.compService.getById(+compId).subscribe({
        next: (comp) => {
          this.formGroup.patchValue({
            ...comp,
            startDate: comp.startDate ? comp.startDate.substring(0, 16) : '',
            endDate: comp.endDate ? comp.endDate.substring(0, 16) : '',
          });
        },
        error: (err) => console.log(err),
      });
    }
  }

  send() {
    if (this.formGroup.invalid) return;

    const compId = this.route.snapshot.paramMap.get('id');
    if (compId) {
      this.compService.update(+compId, this.formGroup.value).subscribe({
        next: (comp) => console.log(comp),
        error: (err) => console.log(err, 'Erro'),
      });
    } else {
      this.compService.craete(this.formGroup.value).subscribe({
        next: (comp) => console.log(comp),
        error: (err) => console.log(err, 'Erro'),
      });
    }
  }
}
