import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionsService } from '../../../core/services/competitions.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';

@Component({
  selector: 'app-competition',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './competition.component.html',
  styleUrl: './competition.component.css',
})
export class CompetitionComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  compService = inject(CompetitionsService);
  fb = inject(FormBuilder);
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
}
