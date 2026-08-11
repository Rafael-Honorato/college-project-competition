import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Competitions, CreateCompetitionDto } from '../interfaces/competitions';
import { Observable, of, shareReplay } from 'rxjs';
import { COMP } from '../constants/competitions';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class CompetitionsService {
  private readonly http: HttpClient = inject(HttpClient);

  constructor() {
    this.refresAll();
  }

  competitions$ = this.http
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

  refresAll() {
    this.competitions$ = of([]);
    this.competitions$ = this.http
      .get<Competitions[]>(`${environment.BASE_URL}${COMP.getAll}`)
      .pipe(shareReplay(1));

    return this.competitions$;
  }

  update() {}

  delete() {}

  reloadCompetition() {}
}
