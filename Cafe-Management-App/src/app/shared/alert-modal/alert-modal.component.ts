import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css']
})
export class AlertModalComponent {
  @Input() message = 'Something happened!';
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
