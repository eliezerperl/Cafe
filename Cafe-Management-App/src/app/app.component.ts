import { Component } from '@angular/core';
import { IdleService } from './services/idle.service';
import { ToastService } from './services/toast.service';
import { SharedService } from './services/shared.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showIdleToast = false;
  isLoading$: Observable<boolean>;

  constructor(
    private idleService: IdleService,
    private sharedService: SharedService,
    private modalService: ToastService
  ) {
    this.isLoading$ = this.sharedService.loading$;
  }

  ngOnInit(): void {
    this.modalService.toastState$.subscribe((show) => {
      this.showIdleToast = show;
    });

    // Detect global activity and trigger handleStay()
    ['click', 'keydown', 'touchstart'].forEach((event) => {
      window.addEventListener(event, this.activityListener, true);
    });
  }

  private activityListener = () => {
    if (this.showIdleToast) {
      this.handleStay();
    }
  };

  handleStay() {
    this.idleService.resetTimer();
    this.modalService.closeToast();
  }

  handleLogout() {
    this.sharedService.logout();
    this.modalService.closeToast();
  }

  title = 'Cafe-Management';
}
