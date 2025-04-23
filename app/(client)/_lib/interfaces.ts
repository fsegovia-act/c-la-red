export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  stockQuantity: number;
  isAvailable: boolean;
  imageUrl?: string;
  tags?: string[];
}

export interface ProductForm {
  name: string;
  description: string;
  price: string;
  sku: string;
  category: string;
  stockQuantity: string;
}

export interface EditProductForm extends ProductForm {
  _id: string,
  imageUrl: string | undefined,
}