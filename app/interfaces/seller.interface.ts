export interface Seller {
  id: number;
  role_id: number;
  email: string;
  first_name: string;
  last_name_paternal: string;
  last_name_maternal: string;
  dni: string;
  birth_date: string;
  gender: "MASCULINO" | "FEMENINO";
  status: "ACTIVE" | "INACTIVE";
  phone?: string;
  address?: string;
  profile_image?: string;
  company_id?: number;
  created_at: string;
  updated_at: string;
  password?: string; // Solo para crear, no viene del backend

  // Relaciones incluidas por el backend
  role: {
    id: number;
    name: string;
    alias: string;
  };
  company?: {
    id: number;
    name: string;
    ruc?: string;
  };
}
