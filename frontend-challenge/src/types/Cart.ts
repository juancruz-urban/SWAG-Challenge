export interface CartItem {
  productId: number; 
  quantity: number;
  price: number;
  name: string;
  sku: string;
  image?: string;
  category: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}