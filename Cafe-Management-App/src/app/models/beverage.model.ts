
export interface Beverage {
  id: string;
  type: string;
  price: number;
  unitsInStock: number;
}

export interface BeverageDTO {
  type: string;
  price: number;
  quantity: number;
}
