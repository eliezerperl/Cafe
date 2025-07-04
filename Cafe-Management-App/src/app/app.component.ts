import { Component } from '@angular/core';
import { IdleService } from './services/idle.service';
import { ToastService } from './services/toast.service';
import { SharedService } from './services/shared.service';
import { Observable } from 'rxjs';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showIdleToast = false;
  isLoading$: Observable<boolean>;
  alertMessage = '';
  alertVisible = false;

  constructor(
    private idleService: IdleService,
    private sharedService: SharedService,
    private modalService: ToastService,
    private alertService: AlertService
  ) {
    this.isLoading$ = this.sharedService.loading$;

    this.alertService.message$.subscribe(msg => {
      if (msg) {
        this.alertMessage = msg;
        this.alertVisible = true;
      }
    });
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

  closeAlert() {
    this.alertVisible = false;
    this.alertService.clear();
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
