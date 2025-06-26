import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/models/cartItem.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  increase(item: CartItem) {
    if (item.quantity < item.beverage.unitsInStock) {
      this.cartService.updateQuantity({
        beverage: item.beverage,
        quantity: item.quantity + 1,
      });
    }
  }

  decrease(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity({
        beverage: item.beverage,
        quantity: item.quantity - 1,
      });
    } else {
      this.remove(item);
    }
  }

  remove(item: CartItem) {
    this.cartService.removeItem(item.beverage.id);
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.beverage.price * item.quantity,
      0
    );
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  checkout() {
    this.router.navigate(['/checkout'], {
      queryParams: {
        total: this.getTotal(),
      },
    });
  }

  backToStore() {
    this.router.navigate(['/store']);
  }
}
