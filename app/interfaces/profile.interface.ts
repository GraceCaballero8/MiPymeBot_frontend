export interface Profile {
  id: number;
  email: string;
  first_name: string;
  last_name_paternal: string;
  last_name_maternal: string;
  dni: string;
  dni_verifier: string;
  birth_date: string;
  gender: "MASCULINO" | "FEMENINO";
  phone: string;
  address: string;
  profile_image: string;
}