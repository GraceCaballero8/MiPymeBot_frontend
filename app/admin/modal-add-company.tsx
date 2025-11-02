"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Company = {
  id: number;
  name: string;
  ruc?: string | null;
  address?: string;
  description?: string;
  logo_url?: string;
  phone?: string;
  sector?: string;
};

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  onCompanyAdded: (newCompany: Company) => void;
};

export function DialogCompanyAdd({ open, setOpen, onCompanyAdded }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ruc: "",
    address: "",
    description: "",
    logo_url: "",
    phone: "",
    sector: "",
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        ruc: "",
        address: "",
        description: "",
        logo_url: "",
        phone: "",
        sector: "",
      });
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/company/create",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Company created:", response.data);
      setOpen(false);
      onCompanyAdded(response.data); // Para refrescar la lista en el dashboard
    } catch (error) {
      console.error("Error creating company:", error);
      alert("Error al crear empresa");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-linear-to-br from-purple-50 to-pink-50 border-0 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader className="pb-4 border-b border-purple-100">
            <DialogTitle className="text-2xl font-bold bg-linear-to-br from-purple-500 to-pink-500 bg-clip-text text-transparent">
              ➕ Agregar Empresa
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              Completa la información para agregar una nueva empresa. Todos los campos obligatorios están marcados.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sector">Sector *</Label>
              <Input
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input
                id="ruc"
                name="ruc"
                value={formData.ruc}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="logo_url">URL del Logo</Label>
              <Input
                id="logo_url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4 border-t border-purple-100">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "➕ Crear Empresa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

