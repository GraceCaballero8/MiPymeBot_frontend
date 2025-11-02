export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  code: string;
  description?: string;
  unit: string;
  min_stock: number;
  cost?: number;
  category_id: number;
  company_id: number;
  status: 'active' | 'inactive';
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: number;
  name: string;
  ruc: string;
  contact: string;
  phone: string;
  email: string;
  address?: string;
  products?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}