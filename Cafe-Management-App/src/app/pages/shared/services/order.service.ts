import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderDTO } from 'src/app/models/order.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(order: OrderDTO): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  // Orders
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}`);
  }

  getOrderDetails(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/details/${id}`);
  }

  //OWNER
  updateOrderTotal(id: string, updatedOrderAmount: Number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, updatedOrderAmount);
  }

  deleteOrder(id: string) {
    return this.http.delete<Order>(`${this.apiUrl}/${id}`);
  }
}
