"use client";

import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DialogSupplierAddProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRefresh: () => void;
}

export function DialogSupplierAdd({ open, setOpen, onRefresh }: DialogSupplierAddProps) {
  const [formData, setFormData] = useState({
    name: "",
    ruc: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
    products: "",
    status: "active" as "active" | "inactive",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      // Obtener la empresa del admin
      const companyResponse = await axios.get("http://localhost:4000/api/company/my", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const response = await axios.post(
        "http://localhost:4000/api/suppliers",
        {
          ...formData,
          company_id: companyResponse.data[0].id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOpen(false);
      onRefresh();
      setFormData({
        name: "",
        ruc: "",
        contact: "",
        phone: "",
        email: "",
        address: "",
        products: "",
        status: "active",
      });
    } catch (error) {
      console.error("Error creating supplier:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
          <DialogDescription>
            Completa los datos para agregar un nuevo proveedor a tu inventario.
          </DialogDescription>
        </DialogHeader>
        
        {/* Contenedor con scroll */}
        <div className="flex-1 overflow-y-auto px-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del proveedor</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Ej: Frescos del Campo S.A."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ruc">RUC</Label>
                <Input
                  id="ruc"
                  name="ruc"
                  value={formData.ruc}
                  onChange={(e) => handleChange("ruc", e.target.value)}
                  placeholder="Ej: 20123456789"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact">Contacto</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={(e) => handleChange("contact", e.target.value)}
                  placeholder="Nombre del contacto"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="987654321"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="correo@proveedor.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Dirección del proveedor"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="products">Productos que suministra</Label>
              <Textarea
                id="products"
                name="products"
                value={formData.products}
                onChange={(e) => handleChange("products", e.target.value)}
                placeholder="Lista de productos que suministra"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
                placeholder="Seleccionar estado"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>

        {/* Footer fijo en la parte inferior */}
        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            onClick={(e) => {
              const form = e.currentTarget.closest('form');
              if (form) {
                form.requestSubmit();
              }
            }}
          >
            {loading ? "Guardando..." : "Guardar proveedor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}