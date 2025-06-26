import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-order-history-modal',
  templateUrl: './order-history-modal.component.html',
  styleUrls: ['./order-history-modal.component.css']
})
export class OrderHistoryModalComponent {
  @Input() orders: Order[] = [];
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
