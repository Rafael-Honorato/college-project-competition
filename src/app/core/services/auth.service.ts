import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { type CreateUserDto, LoginUserDto, User } from '../interfaces/user';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AUTH } from '../constants/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly user = signal<User | null>(this.getUserFormStorage());
  readonly user$ = this.user.asReadonly();

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.BASE_URL}${AUTH.getAll}`);
  }

  register(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(
      `${environment.BASE_URL}${AUTH.register}`,
      user,
    );
  }

  login(credentials: LoginUserDto): Observable<User> {
    return this.http
      .post<User>(`${environment.BASE_URL}${AUTH.login}`, credentials)
      .pipe(tap((loggedUser) => this.localStorageUser(loggedUser)));
  }

  private getUserFormStorage(): User | null {
    const savedUser = localStorage.getItem(AUTH.localStorageKey);
    if (!savedUser) return null;

    try {
      return JSON.parse(savedUser) as User;
    } catch (error) {
      localStorage.removeItem(AUTH.localStorageKey);
      return null;
    }
  }

  localStorageUser(user: User): void {
    if (user) localStorage.setItem(AUTH.localStorageKey, JSON.stringify(user));
  }
}
