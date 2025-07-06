// services/idle.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class IdleService {
  private idleTimeout = 2 * 60 * 1000; // 2 minutes
  private warningDuration = 2 * 60 * 1000; // 2 minutes
  private idleTimeoutId: any;
  private warningTimeoutId: any;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private sharedService: SharedService,
  ) {
    this.sharedService.logout$.subscribe(() => {
      this.stopWatching();
    });
  }

  private boundResetTimer = this.resetTimer.bind(this);

  public startWatching() {
    this.resetTimer();

    ['click', 'mousemove', 'keydown', 'touchstart'].forEach((event) =>
      window.addEventListener(event, this.boundResetTimer)
    );
    console.log('Started watching for toast');
  }

  public stopWatching() {
    clearTimeout(this.idleTimeoutId);
    clearTimeout(this.warningTimeoutId);
    this.toastService.closeToast();

    ['click', 'mousemove', 'keydown', 'touchstart'].forEach((event) =>
      window.removeEventListener(event, this.boundResetTimer)
    );
    console.log('Stopped watching for toast');
  }

  public resetTimer() {
    clearTimeout(this.idleTimeoutId);
    clearTimeout(this.warningTimeoutId);

    this.idleTimeoutId = setTimeout(() => {
      this.showWarningPopup();
    }, this.idleTimeout);
  }

  private showWarningPopup() {
    this.toastService.openToast();
    this.warningTimeoutId = setTimeout(() => {
      this.sharedService.logout();
      this.router.navigate(['/login']);
      this.toastService.closeToast();
    }, this.warningDuration);
  }
}
