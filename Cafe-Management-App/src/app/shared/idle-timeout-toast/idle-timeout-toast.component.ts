import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-idle-timeout-toast',
  templateUrl: './idle-timeout-toast.component.html',
  styleUrls: ['./idle-timeout-toast.component.css'],
})
export class IdleTimeoutToastComponent {
  @Input() show: boolean = false;
  @Output() logoutUser = new EventEmitter<void>();

  countdown: number = 120;
  private intervalId: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show']) {
      if (this.show) {
        this.startCountdown();
      } else {
        this.clearCountdown();
      }
    }
  }

  private startCountdown() {
    this.clearCountdown();
    this.countdown = 120;
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.logoutUser.emit();
        this.clearCountdown();
      }
    }, 1000);
  }

  private clearCountdown() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy() {
    this.clearCountdown();
  }
}
