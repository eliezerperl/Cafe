import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

export const loginGuard = () => {
  const sharedService = inject(SharedService);
  const router = inject(Router);

  if (sharedService.isLoggedIn()) {
    // Redirect logged-in users away from login page
    console.log('Login guard prevented you from navigating');
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
