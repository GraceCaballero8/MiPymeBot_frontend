export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name_paternal: string;
  last_name_maternal: string;
  role: {
    id: number;
    name: string;
    alias: string;
  };
  company_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name_paternal: string;
  last_name_maternal: string;
  dni: string;
  birth_date: string;
  gender: "MASCULINO" | "FEMENINO";
}

export interface AuthResponse {
  user: User;
  token: string;
}
