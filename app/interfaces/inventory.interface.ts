export interface InventoryMovement {
  id: number;
  product_id: number;
  type: "INGRESO" | "EGRESO";
  quantity: number;
  movement_date: string;
  observations?: string;
  user_id: number;
  company_id: number;
  created_at: string;
  product?: {
    sku: string;
    name: string;
  };
  user?: {
    first_name: string;
    last_name_paternal: string;
  };
}

export interface InventoryStatus {
  codigo: string;
  nombre: string;
  unidad: string;
  grupo: string;
  stock_minimo: number;
  stock_actual: number;
  estado: "Sin Stock" | "Stock Bajo" | "Stock OK";
}

export interface CreateMovementDto {
  product_code: string;
  type: "INGRESO" | "EGRESO";
  quantity: number;
  movement_date: string;
  observations?: string;
}

export interface ProductKardex {
  producto: {
    sku: string;
    nombre: string;
  };
  kardex: {
    fecha: string;
    tipo: "INGRESO" | "EGRESO";
    cantidad: number;
    saldo: number;
    observaciones?: string;
    registrado_por: string;
  }[];
}
