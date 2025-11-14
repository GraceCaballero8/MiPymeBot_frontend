"use client";

import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
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

interface DialogCategoryAddProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRefresh: () => void;
}

// Iconos predeterminados por categorías
const ICON_OPTIONS = [
  { value: "fa-tshirt", label: "Ropa", icon: "👕" },
  { value: "fa-mobile-alt", label: "Tecnología", icon: "📱" },
  { value: "fa-utensils", label: "Comida", icon: "🍽️" },
  { value: "fa-home", label: "Hogar", icon: "🏠" },
  { value: "fa-car", label: "Vehículos", icon: "🚗" },
  { value: "fa-dumbbell", label: "Deportes", icon: "🏋️" },
  { value: "fa-book", label: "Libros", icon: "📚" },
  { value: "fa-gamepad", label: "Juegos", icon: "🎮" },
  { value: "fa-music", label: "Música", icon: "🎵" },
  { value: "fa-palette", label: "Arte", icon: "🎨" },
  { value: "fa-heartbeat", label: "Salud", icon: "💊" },
  { value: "fa-baby", label: "Bebés", icon: "👶" },
  { value: "fa-graduation-cap", label: "Educación", icon: "🎓" },
  { value: "fa-plane", label: "Viajes", icon: "✈️" },
  { value: "fa-paw", label: "Mascotas", icon: "🐾" },
  { value: "fa-gift", label: "Regalos", icon: "🎁" },
  { value: "fa-briefcase", label: "Oficina", icon: "💼" },
  { value: "fa-tools", label: "Herramientas", icon: "🔧" },
  { value: "fa-seedling", label: "Jardinería", icon: "🌱" },
  { value: "fa-box", label: "General", icon: "📦" },
];

// Opciones de colores con estilos correctos
const COLOR_OPTIONS = [
  { value: "red", label: "Rojo", color: "bg-red-500", hex: "#ef4444" },
  { value: "blue", label: "Azul", color: "bg-blue-500", hex: "#3b82f6" },
  { value: "green", label: "Verde", color: "bg-green-500", hex: "#10b981" },
  { value: "yellow", label: "Amarillo", color: "bg-yellow-500", hex: "#eab308" },
  { value: "purple", label: "Morado", color: "bg-purple-500", hex: "#a855f7" },
  { value: "orange", label: "Naranja", color: "bg-orange-500", hex: "#f97316" },
  { value: "pink", label: "Rosa", color: "bg-pink-500", hex: "#ec4899" },
  { value: "gray", label: "Gris", color: "bg-gray-500", hex: "#6b7280" },
  { value: "indigo", label: "Índigo", color: "bg-indigo-500", hex: "#6366f1" },
  { value: "teal", label: "Turquesa", color: "bg-teal-500", hex: "#14b8a6" },
];

export function DialogCategoryAdd({ open, setOpen, onRefresh }: DialogCategoryAddProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "fa-box",
    color: "blue",
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
        toast.error("No tienes sesión activa");
        window.location.href = "/";
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/categories",
        formData, // Solo envía los datos del formulario
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Categoría creada exitosamente");
      setOpen(false);
      onRefresh();
      setFormData({
        name: "",
        description: "",
        icon: "fa-box",
        color: "blue",
        status: "active",
      });
    } catch (error: any) {
      console.error("Error creating category:", error);
      
      // Manejo mejorado de errores
      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        if (Array.isArray(msg)) {
          toast.error(msg.join(", "));
        } else if (typeof msg === "string") {
          toast.error(msg);
        } else {
          toast.error("Error al crear la categoría");
        }
      } else {
        toast.error("Error al crear la categoría");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Agregar Nueva Categoría</DialogTitle>
          <DialogDescription>
            Completa los datos para agregar una nueva categoría a tu inventario.
          </DialogDescription>
        </DialogHeader>
        
        {/* Contenedor con scroll */}
        <div className="flex-1 overflow-y-auto px-1">
          <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre de la categoría</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ej: Ropa Deportiva"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Descripción de la categoría"
                rows={3}
              />
            </div>
            
            {/* Selector de Iconos con Emojis */}
            <div className="grid gap-2">
              <Label htmlFor="icon">Icono</Label>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 border rounded-md bg-gray-50">
                {ICON_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      formData.icon === option.value
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    onClick={() => handleChange("icon", option.value)}
                    title={option.label}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="text-xs text-gray-600 truncate">{option.label}</div>
                  </button>
                ))}
              </div>
              <input type="hidden" name="icon" value={formData.icon} />
            </div>

            {/* Selector de Colores Visuales */}
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <div className="grid grid-cols-8 gap-2 p-3 border rounded-md bg-gray-50">
                {COLOR_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`w-8 h-8 rounded-md border-2 transition-all hover:scale-110 ${
                      formData.color === option.value
                        ? "border-gray-800 ring-2 ring-offset-2 ring-gray-400"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: option.hex }}
                    onClick={() => handleChange("color", option.value)}
                    title={option.label}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Color seleccionado: <span className="font-semibold">{COLOR_OPTIONS.find(c => c.value === formData.color)?.label}</span>
              </div>
              <input type="hidden" name="color" value={formData.color} />
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
            form="category-form"
          >
            {loading ? "Guardando..." : "Guardar categoría"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}