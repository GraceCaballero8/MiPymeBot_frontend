"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import useFetchApi from "@/hooks/use-fetch";

interface SellerAddModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SellerAddModal({
  open,
  onClose,
  onSuccess,
}: SellerAddModalProps) {
  const { post } = useFetchApi();
  const [form, setForm] = useState({
    first_name: "",
    last_name_paternal: "",
    last_name_maternal: "",
    email: "",
    password: "",
    dni: "",
    birth_date: "",
    gender: "MASCULINO",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const loadingToast = toast.loading("Agregando vendedor...");

    try {
      await post<{ message: string }, typeof form>("/users/sellers", form);

      toast.success("¡Vendedor agregado exitosamente!", {
        id: loadingToast,
      });
      onSuccess();
      onClose();
      setForm({
        first_name: "",
        last_name_paternal: "",
        last_name_maternal: "",
        email: "",
        password: "",
        dni: "",
        birth_date: "",
        gender: "MASCULINO",
        phone: "",
        address: "",
      });
    } catch (error: any) {
      let errorMessage = "Error al agregar vendedor";

      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        if (Array.isArray(msg)) {
          errorMessage = msg.join(", ");
        } else if (typeof msg === "string") {
          errorMessage = msg;
        }
      }

      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Vendedor</DialogTitle>
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
              <label className="block text-sm font-medium mb-1">
                Nombres *
              </label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Apellido Paterno *
              </label>
              <input
                type="text"
                name="last_name_paternal"
                value={form.last_name_paternal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Apellido Materno *
              </label>
              <input
                type="text"
                name="last_name_maternal"
                value={form.last_name_maternal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                DNI (8 dígitos) *
              </label>
              <input
                type="text"
                name="dni"
                value={form.dni}
                onChange={handleChange}
                required
                maxLength={8}
                pattern="[0-9]{8}"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Género *</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </select>
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
              {saving ? "Guardando..." : "Agregar Vendedor"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
