import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { type CreateUserDto, LoginUserDto, User } from '../interfaces/user';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AUTH } from '../constants/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _user = signal<number | null>(this.getUserFormStorage());
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());

  readonly users$ = this.http
    .get<User[]>(`${environment.BASE_URL}${AUTH.getAll}`)
    .pipe(shareReplay(1));

  register(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(
      `${environment.BASE_URL}${AUTH.register}`,
      user,
    );
  }

  login(credentials: LoginUserDto): Observable<User> {
    return this.http
      .post<User>(`${environment.BASE_URL}${AUTH.login}`, credentials)
      .pipe(tap((loggedUser) => this.localStorageUser(loggedUser.userId)));
  }

  loggout() {
    localStorage.removeItem(AUTH.localStorageKey);
    this._user.set(null);
  }

  private getUserFormStorage(): number | null {
    const savedId = localStorage.getItem(AUTH.localStorageKey);
    if (!savedId) return null;

    try {
      return JSON.parse(savedId);
    } catch (error) {
      localStorage.removeItem(AUTH.localStorageKey);
      return null;
    }
  }

  private localStorageUser(userId: number): void {
    if (userId) {
      localStorage.setItem(AUTH.localStorageKey, JSON.stringify(userId));
      this._user.set(userId);
    }
  }
}
