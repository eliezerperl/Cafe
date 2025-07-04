import { Component } from '@angular/core';
import { Beverage } from 'src/app/models/beverage.model';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent {
  beverages: Beverage[] = [];

  constructor(
    private storeService: StoreService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.storeService.getBeverages().subscribe({
      next: (data) => {
        this.beverages = data;
        const cartItems = this.cartService.items;

        this.beverages = data.map(bev => {
          const cartItem = cartItems.find(ci => ci.beverage.id === bev.id);
          const adjustedStock = cartItem
            ? Math.max(0, bev.unitsInStock - cartItem.quantity)
            : bev.unitsInStock;
          return {
            ...bev,
            unitsInStock: adjustedStock,
          };
        });
      },
      error: (err) => console.error(err),
    });
  }

  addToCart(beverage: Beverage) {
    const existingItem = this.cartService.items.find(
      (i) => i.beverage.id === beverage.id
    );
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    if (beverage.unitsInStock > 0) {
      this.cartService.updateQuantity({ beverage, quantity: newQuantity });
      beverage.unitsInStock--;
    }
  }
}
