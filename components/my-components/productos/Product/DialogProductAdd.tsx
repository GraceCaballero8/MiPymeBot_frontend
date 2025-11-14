"use client";

import { useState, useEffect } from "react";
import { Category } from "@/app/interfaces/product.interface";
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

interface DialogProductAddProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRefresh: () => void;
}

export function DialogProductAdd({ open, setOpen, onRefresh }: DialogProductAddProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    unit: "kg",
    price: 0,
    cost: 0,
    stock: 0,
    min_stock: 0,
    category_id: 0,
    status: "active" as "active" | "inactive",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [generatedCode, setGeneratedCode] = useState("");

  const handleChange = (name: string, value: string | number) => {
    const numericFields = ['price', 'cost', 'stock', 'min_stock', 'category_id'];
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) 
        ? Number(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando formulario con datos:", formData);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/products",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Respuesta del servidor:", response.data);

      setOpen(false);
      onRefresh();
      setFormData({
        name: "",
        code: "",
        description: "",
        unit: "kg",
        price: 0,
        cost: 0,
        stock: 0,
        min_stock: 0,
        category_id: 0,
        status: "active",
      });
      setGeneratedCode("");
    } catch (error) {
      console.error("Error creating product:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        console.error("Status:", error.response?.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:4000/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Función para generar código en el frontend (opcional, para mostrar vista previa)
  const generatePreviewCode = (categoryName: string, existingCodes: string[] = []) => {
    if (!categoryName) return "";
    
    const cleanName = categoryName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z\s]/g, '')
      .trim();

    let prefix = '';
    
    if (cleanName.includes(' ')) {
      const words = cleanName.split(' ').filter(word => word.length > 0);
      prefix = words.map(word => word[0]).join('').substring(0, 5);
    } else {
      prefix = cleanName.substring(0, Math.min(5, cleanName.length));
    }

    if (prefix.length < 3) {
      prefix = prefix.padEnd(3, 'X');
    }

    const sequence = (existingCodes.length + 1).toString().padStart(3, '0');
    return `${prefix}-${sequence}`;
  };

  // Actualizar el código cuando cambia la categoría
  const handleCategoryChange = (value: string) => {
    const categoryId = Number(value);
    setFormData(prev => ({ ...prev, category_id: categoryId }));
    
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (selectedCategory) {
      const previewCode = generatePreviewCode(selectedCategory.name);
      setGeneratedCode(previewCode);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          <DialogDescription>
            Completa los datos para agregar un nuevo producto a tu inventario. El código se generará automáticamente.
          </DialogDescription>
        </DialogHeader>
        
        {/* Contenedor con scroll */}
        <div className="flex-1 overflow-y-auto px-1">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del producto</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Ej: Manzana Roja"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Código (Auto-generado)</Label>
                <Input
                  id="code"
                  name="code"
                  value={generatedCode || "Selecciona una categoría"}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                  placeholder="Se generará automáticamente"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category_id">Categoría</Label>
                <Select
                  value={formData.category_id.toString()}
                  onValueChange={handleCategoryChange}
                  placeholder="Seleccionar categoría"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unidad de medida</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleChange("unit", value)}
                  placeholder="Seleccionar unidad"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogramos</SelectItem>
                    <SelectItem value="unit">Unidades</SelectItem>
                    <SelectItem value="dozen">Docenas</SelectItem>
                    <SelectItem value="liter">Litros</SelectItem>
                    <SelectItem value="package">Paquetes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio de venta</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="S/. 0.00"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cost">Costo</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => handleChange("cost", e.target.value)}
                  placeholder="S/. 0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock inicial</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="min_stock">Stock mínimo</Label>
                <Input
                  id="min_stock"
                  name="min_stock"
                  type="number"
                  min="0"
                  value={formData.min_stock}
                  onChange={(e) => handleChange("min_stock", e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Descripción del producto"
                rows={3}
              />
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
            form="product-form" // Vincular el botón al formulario
          >
            {loading ? "Guardando..." : "Guardar producto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}