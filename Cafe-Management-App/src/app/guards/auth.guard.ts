import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';
import { UserService } from '../services/user.service';

export const authGuard = async () => {
  const authService = inject(AuthService);
  const sharedService = inject(SharedService);
  const userService = inject(UserService);
  const router = inject(Router);

  const redirectToLogin = () => {
    sharedService.logout();
    router.navigate(['/login']);
  };

  if (!authService.isLoggedIn()) {
    console.log('AuthGuard Not logged In');
    redirectToLogin();
    return false;
  }
  return true;
};
