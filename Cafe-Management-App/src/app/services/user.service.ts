import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Order } from '../models/order.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Role } from '../models/enums/role.enum';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userIdSubject = new BehaviorSubject<string | null>(null);
  userId$ = this.userIdSubject.asObservable();

  private nameSubject = new BehaviorSubject<string | null>(null);
  name$ = this.nameSubject.asObservable();

  private roleSubject = new BehaviorSubject<Role | null>(null);
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient) {}

  getMyOrderHistory(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/${userId}`);
  }

  parseToken(token: string) {
    const rolePath =
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    try {
      const decoded: any = jwtDecode(token);
      this.userIdSubject.next(decoded.id);
      this.nameSubject.next(decoded.username);
      this.roleSubject.next(decoded[rolePath]);
    } catch (e) {
      console.error('Failed to decode token', e);
      this.userIdSubject.next(null);
      this.roleSubject.next(null);
    }
  }

  getUsername(): string | null {
    return this.nameSubject.getValue();
  }

  getUserId(): string | null {
    return this.userIdSubject.getValue();
  }

  getRole(): Role | null {
    return this.roleSubject.getValue();
  }

  clearUser() {
    this.userIdSubject.next(null);
    this.roleSubject.next(null);
    this.nameSubject.next(null);
  }
}
