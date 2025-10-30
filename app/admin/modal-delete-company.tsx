"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  setOpen: Function;
  company: any;
  setCompanyToDelete: Function;
};

export function DialogCompanyDelete({ open, setOpen, company, setCompanyToDelete }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:4000/api/admin/companies/${company.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Company deleted:", company.id);
      setOpen(false);
      setCompanyToDelete(null);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting company:", error);
      alert("Error al eliminar empresa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setCompanyToDelete(null);
      }}
    >
      <DialogContent className="sm:max-w-[500px] bg-linear-to-br from-red-50 to-pink-50 border-0 shadow-2xl">
        <DialogHeader className="pb-4 border-b border-red-100">
          <DialogTitle className="text-2xl font-bold bg-linear-to-br from-red-600 to-pink-600 bg-clip-text text-transparent">
            🗑️ Eliminar Empresa
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            ¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-red-100">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Empresa a eliminar:
            </p>
            <div className="space-y-2">
              <p className="text-lg font-bold text-gray-800">{company?.name}</p>
              {company?.ruc && <p className="text-sm text-gray-600">RUC: {company.ruc}</p>}
              {company?.sector && <p className="text-sm text-gray-600">Sector: {company.sector}</p>}
              {company?.phone && <p className="text-sm text-gray-600">📞 Tel: {company.phone}</p>}
              {company?.address && <p className="text-sm text-gray-600">🏠 Dirección: {company.address}</p>}
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800 flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <span>
                <strong>Advertencia:</strong> Todos los datos relacionados con esta empresa se perderán permanentemente.
              </span>
            </p>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-4 border-t border-red-100">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="bg-linear-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-red-500/30 transition-all duration-200"
          >
            {loading ? "Eliminando..." : "🗑️ Eliminar Empresa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
