export interface Company {
  id: number;
  name: string;
  ruc?: string;
  admin_id: number;
  created_at: string;
  address?: string;
  description?: string;
  logo_url?: string;
  image_url?: string;
  phone?: string;
  sector: string;
  updated_at: string;
}
