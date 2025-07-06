import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject, Subscription } from 'rxjs';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private logoutSubject = new Subject<void>();
  logout$ = this.logoutSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public loggedIn$ = this.loggedInSubject.asObservable();

  private refreshSub: Subscription | null = null;
  private countdownSub: Subscription | null = null;
  private countdownSeconds = 300; // 5 minutes

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  showSpinner() {
    this.loadingSubject.next(true);
  }

  hideSpinner() {
    this.loadingSubject.next(false);
  }

  loginActions(token: string) {
    this.setLoggedIn();
    this.userService.parseToken(token);
    this.startAutoRefresh();
    this.router.navigate(['/dashboard']);
  }

  logoutActions() {
    this.logoutSubject.next(); // Notifies subscribers
    this.userService.clearUser();
    this.setNotLoggedIn();
    this.stopAutoRefresh();
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.logoutActions(),
      error: (err) => {
        console.warn('Server-side logout failed', err);
        this.logoutActions();
      },
    });
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

  startAutoRefresh(): void {
    this.stopAutoRefresh(); // ensure no duplication
    console.log('Started watching for Auto Refresh');
    const userId = this.userService.getUserId();
    if (!userId || !this.isLoggedIn()) return;

    // Start refresh interval
    this.refreshSub = interval(this.countdownSeconds * 1000).subscribe(() => {
      this.authService.refresh(userId).subscribe({
        next: (res: AuthResponse) => {
          console.log('🔄 Token refreshed successfully');
        },
        error: (err) => {
          console.warn('❌ Token refresh failed:', err);
        },
      });
    });
  }

  stopAutoRefresh(): void {
    this.refreshSub?.unsubscribe();
    this.countdownSub?.unsubscribe();
    console.log('⛔ Auto refresh stopped');
  }
}
