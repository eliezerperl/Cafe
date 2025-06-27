import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Redirect logged-in users away from login page
    console.log('Login guard prevented you from navigating');
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
