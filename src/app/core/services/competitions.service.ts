import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Competitions, CreateCompetitionDto } from '../interfaces/competitions';
import { Observable, shareReplay } from 'rxjs';
import { COMP } from '../constants/competitions';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CompetitionsService {
  private readonly http: HttpClient = inject(HttpClient);

  readonly competitions$ = this.http
    .get<Competitions[]>(`${environment.BASE_URL}${COMP.getAll}`)
    .pipe(shareReplay(1));

  getAll(): Observable<Competitions[]> {
    return this.competitions$;
  }

  getById(id: number): Observable<Competitions> {
    return this.http.get<Competitions>(
      `${environment.BASE_URL}${COMP.getById}`,
      {
        params: { id: id.toString() },
      },
    );
  }

  craete(competition: CreateCompetitionDto): Observable<Competitions> {
    return this.http.post<Competitions>(
      `${environment.BASE_URL}${COMP.create}`,
      competition,
    );
  }

  update() {}

  delete() {}

  reloadCompetition() {}
}
