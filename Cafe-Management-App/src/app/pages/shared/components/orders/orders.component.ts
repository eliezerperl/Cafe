// admin/orders.component.ts
import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrderService } from '../../services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';
  editingOrderId: string | null = null;
  editedTotal = 0;

  constructor(
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
      },
    });
  }

  orderDetails: Order | null = null;
  showModal = false;

  viewDetails(orderId: string) {
    this.orderService.getOrderDetails(orderId).subscribe({
      next: (data) => {
        this.orderDetails = data;
        this.showModal = true;
      },
      error: (err) => console.error(err),
    });
  }

  closeModal() {
    this.showModal = false;
    this.orderDetails = null;
  }

  //OWNER
  deleteOrder(orderId: string) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => this.fetchOrders(),
        error: () => (this.error = 'Failed to delete order'),
      });
    }
  }

  startEdit(order: Order) {
    this.editingOrderId = order.id;
    this.editedTotal = order.totalAmount;
  }

  cancelEdit() {
    this.editingOrderId = null;
    this.editedTotal = 0;
  }

  saveEdit(order: Order) {
    if (this.editedTotal < 0) return;

    this.orderService
      .updateOrderTotal(order.id, this.editedTotal)
      .subscribe({
        next: () => {
          order.totalAmount = this.editedTotal;
          this.cancelEdit();
        },
        error: () => (this.error = 'Failed to update order price'),
      });
  }

  isOwner(): boolean {
    const role = this.userService.getRole();
    return role?.toLowerCase() === 'owner';
  }
}
