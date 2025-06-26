import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cartItem.model';
import { SharedService } from './shared.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(
    this.loadCartFromStorage()
  );
  items$ = this.itemsSubject.asObservable();

  constructor(
    private userService: UserService,
    private sharedService: SharedService
  ) {
    const storedItems = this.loadCartFromStorage();
    this.itemsSubject.next(storedItems);

    this.sharedService.logout$.subscribe(() => {
      this.clearCart();
    });
  }

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  private getCartKey(): string {
    const userId = this.userService.getUserId();
    return `cartItems_${userId}`;
  }

  updateQuantity(item: CartItem) {
    const existingItem = this.items.find(
      (i) => i.beverage.id === item.beverage.id
    );
    if (existingItem) {
      existingItem.quantity = item.quantity;
    } else {
      this.items.push({ ...item });
    }
    this.updateCartState();
  }

  removeItem(bevId: string) {
    const updated = this.items.filter((n) => n.beverage.id !== bevId);
    this.itemsSubject.next(updated);
    this.saveCartToStorage(updated);
  }

  clearCart() {
    this.itemsSubject.next([]);
    const myCart: string = this.getCartKey();
    localStorage.removeItem(myCart);
  }

  private updateCartState() {
    const updated = [...this.items];
    this.itemsSubject.next(updated);
    this.saveCartToStorage(updated);
  }

  private saveCartToStorage(cart: CartItem[]) {
    localStorage.setItem(this.getCartKey(), JSON.stringify(cart));
  }

  private loadCartFromStorage(): CartItem[] {
    const stored = localStorage.getItem(this.getCartKey());
    return stored ? JSON.parse(stored) : [];
  }
}
