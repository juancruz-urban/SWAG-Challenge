export interface Product {
  id: number
  name: string
  sku: string
  category: string
  supplier: string
  status: 'active' | 'inactive' | 'pending'
  basePrice: number
  stock: number
  description?: string
  image?: string
  colors?: string[]
  sizes?: string[]
  features?: string[]
  // Pricing calculation fields
  minQuantity?: number
  maxQuantity?: number
  priceBreaks?: PriceBreak[]
}

export interface PriceBreak {
  minQty: number
  price: number
  discount?: number
}

export interface CartItem extends Product {
  quantity: number
  selectedColor?: string
  selectedSize?: string
  unitPrice: number
  totalPrice: number
}

export interface Category {
  id: string
  name: string
  icon: string
  count: number
}

export interface Supplier {
  id: string
  name: string
  products: number
}