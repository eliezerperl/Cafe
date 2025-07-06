
export interface Beverage {
  id: string;
  type: string;
  price: number;
  unitsInStock: number;
  imageUrl?: string;
}

export interface BeverageDTO {
  type: string;
  price: number;
  quantity: number;
}
