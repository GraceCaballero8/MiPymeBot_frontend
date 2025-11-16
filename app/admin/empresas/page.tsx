"use client";

import { EmpresasTable } from "@/components/my-components/empresas/EmpresasTable";
import { useAuth } from "@/context/auth-context";

export default function EmpresasPage() {
  const { user } = useAuth();
  console.log(user);

  if (user?.role?.name !== "admin") {
    return <div>No tienes permiso para ver esta página.</div>;
  }

  return <EmpresasTable />;
}
