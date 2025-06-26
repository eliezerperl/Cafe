import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';
import { firstValueFrom } from 'rxjs';

export const authGuard = async () => {
  const authService = inject(AuthService);
  const sharedService = inject(SharedService);
  const router = inject(Router);

  const redirectToLogin = () => {
    sharedService.logout();
    router.navigate(['/login']);
  };

  try {
    const user = await firstValueFrom(authService.validate());
    if (user && user.id) {
      return true;
    } else {
      console.log('AuthGuard: Invalid user returned from validate');
      redirectToLogin();
      return false;
    }
  } catch (err) {
    console.warn('AuthGuard: Backend validation failed', err);
    redirectToLogin();
    return false;
  }
};
