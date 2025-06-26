import { Beverage } from './beverage.model';

export interface Order {
  id: string;
  userId: string;
  customerName: string,
  beverageOrders: OrderItem[];
  totalAmount: number;
  orderDate: Date;
}

export interface OrderItem {
  beverage: Beverage;
  quantity: number;
}
export interface OrderDTO {
  customerName: string;
  userId: string;
  totalAmount: number;
  beverages: OrderItemDTO[];
}

export interface OrderItemDTO {
  beverageId: string;
  quantity: number;
}