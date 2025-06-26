import { Component, Input } from '@angular/core';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-order-details-modal',
  templateUrl: './order-details-modal.component.html',
  styleUrls: ['./order-details-modal.component.css']
})
export class OrderDetailsModalComponent {
  @Input() order: Order | null = null;
  @Input() show: boolean = false;
  @Input() onClose: () => void = () => {};
}
