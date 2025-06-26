import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { AuthRequest } from '../models/auth-request.model';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  changePassword(data: {
    username: string;
    oldPassword: string;
    newPassword: string;
  }) {
    return this.http.put<void>(`${this.apiUrl}/change-password`, data);
  }

  register(credentials: AuthRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, credentials);
  }

  validate(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/validate`);
  }

  refresh(userId: string | null): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh/${userId}`, {});
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {});
  }

  //Helper method
  autoRegisterAndLogin(credentials: AuthRequest): Observable<any> {
    return this.register(credentials).pipe(
      switchMap(() => this.login(credentials))
    );
  }

  setLoggedIn() {
    this.loggedInSubject.next(true);
  }

  setNotLoggedIn() {
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    if (this.loggedInSubject) {
      return this.loggedInSubject.getValue();
    }
    return false;
  }
}
