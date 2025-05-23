import { UserRole } from "../../api/_lib/interfaces";

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
  _id: string;
  imageUrl: string | undefined;
  file?: any;
  isAvailable: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  navItems: NavItem[];
  variant?: "slide-right" | "slide-down" | "fade";
  colorScheme?: "light" | "dark";
}

export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  isActive?: boolean;
  role?: UserRole;
}