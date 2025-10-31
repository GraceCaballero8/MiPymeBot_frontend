"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Seller } from "@/app/interfaces/seller.interface";
import { X } from "lucide-react";

interface SellerEditModalProps {
  open: boolean;
  seller: Seller;
  onClose: () => void;
  onSuccess: () => void;
}

export function SellerEditModal({
  open,
  seller,
  onClose,
  onSuccess,
}: SellerEditModalProps) {
  const [form, setForm] = useState({
    first_name: "",
    last_name_paternal: "",
    last_name_maternal: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (seller) {
      setForm({
        first_name: seller.first_name || "",
        last_name_paternal: seller.last_name_paternal || "",
        last_name_maternal: seller.last_name_maternal || "",
        phone: seller.phone || "",
        address: seller.address || "",
      });
    }
  }, [seller]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const loadingToast = toast.loading("Actualizando vendedor...");

    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:4000/api/users/${seller.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("¡Vendedor actualizado exitosamente!", {
        id: loadingToast,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al actualizar vendedor",
        {
          id: loadingToast,
        }
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar Vendedor</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombres</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Apellido Paterno
              </label>
              <input
                type="text"
                name="last_name_paternal"
                value={form.last_name_paternal}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Apellido Materno
              </label>
              <input
                type="text"
                name="last_name_maternal"
                value={form.last_name_maternal}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
