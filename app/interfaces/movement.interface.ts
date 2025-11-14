export interface Movement {
  id: number;
  type: 'ENTRADA' | 'SALIDA';
  quantity: number;
  date: string;
  reason?: string;
  product_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    name: string;
    code: string;
  };
  user: {
    id: number;
    first_name: string;
    last_name_paternal: string;
    last_name_maternal: string;
  };
}