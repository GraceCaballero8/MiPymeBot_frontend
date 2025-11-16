export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  price?: number;
  min_stock: number;
  unit_id: number;
  group_id: number;
  user_id: number;
  company_id: number;
  created_at: string;
  updated_at: string;
  unit?: {
    id: number;
    name: string;
    abbreviation: string;
  };
  group?: {
    id: number;
    name: string;
  };
}

export interface ProductGroup {
  id: number;
  name: string;
  company_id: number;
}

export interface UnitOfMeasure {
  id: number;
  name: string;
  abbreviation: string;
  company_id: number;
}

export interface CreateProductDto {
  sku: string;
  name: string;
  unit_id: number;
  group_id: number;
  min_stock: number;
  price?: number;
}
