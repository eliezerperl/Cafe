import { Beverage } from './beverage.model';

export interface CartItem {
  beverage: Beverage;
  quantity: number;
}
