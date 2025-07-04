import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/models/cartItem.model';
import { Router } from '@angular/router';
import { OrderService } from '../shared/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { OrderDTO } from 'src/app/models/order.model';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;
  tax = 0;
  totalWithTax = 0;
  customerName = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cartService.items$.subscribe((items) => {
      this.cartItems = items;
    });
    this.route.queryParams.subscribe((params) => {
      this.total = +params['total'] || 0;
      this.tax = +params['tax'] || 0;
      this.totalWithTax = +params['totalWithTax'] || 0;
    });
  }

  confirmCheckout() {
    const userId = this.userService.getUserId();
    if (!userId) return this.alertService.show('User not logged in.');

    const order: OrderDTO = {
      customerName: this.customerName,
      userId,
      totalAmount: this.total,
      beverages: this.cartItems.map((item) => ({
        beverageId: item.beverage.id,
        quantity: item.quantity,
      })),
    };

    this.orderService.placeOrder(order).subscribe({
      next: (response) => {
        this.alertService.show('Order placed successfully!');
        this.cartService.clearCart();
        const orderId = response.id;
        this.router.navigate(['/invoice', orderId]);
      },
      error: (err) => {
        console.error(err);
        this.alertService.show('Failed to place order.');
      },
    });
  }
}
