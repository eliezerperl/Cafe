import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<boolean>();
  toastState$ = this.toastSubject.asObservable();

  openToast() {
    this.toastSubject.next(true);
  }

  closeToast() {
    this.toastSubject.next(false);
  }
}
