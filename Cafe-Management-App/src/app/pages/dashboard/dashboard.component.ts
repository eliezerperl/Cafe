import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalOrders: number = 0;
  totalSpent: number = 0;
  favoriteBeverage: string = 'N/A';
  userId: string = '';
  orders: Order[] = [];
  showModal = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.userId$.subscribe((id) => {
      if (id) {
        this.userId = id;
        this.getMyOrderHistory(id);
      }
    });
  }
  openOrderHistory() {
    this.userService.getMyOrderHistory(this.userId).subscribe((orders) => {
      this.orders = orders;
      this.showModal = true;
    });
  }

  closeOrderHistory() {
    this.showModal = false;
  }

  getMyOrderHistory(userId: string) {
    this.userService.getMyOrderHistory(userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.totalOrders = orders.length;
        this.totalSpent = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );

        const beverageMap = new Map<string, number>();
        orders.forEach((order) => {
          order.beverageOrders.forEach((item) => {
            const type = item.beverage?.type;
            if (type) {
              beverageMap.set(
                type,
                (beverageMap.get(type) || 0) + item.quantity
              );
            }
          });
        });

        this.favoriteBeverage =
          [...beverageMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
      },
      error: (err) => console.error('Failed to fetch order history', err),
    });
  }
}
