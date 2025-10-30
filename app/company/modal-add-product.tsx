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

type props = {
  open: boolean;
  setOpen: Function;
  onProductAdded: Function;
};

export function DialogProductAdd(props: props) {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
  });

  useEffect(() => {
    if (!props.open) {
      setFormData({
        name: "",
        price: 0,
        stock: 0,
      });
      setSelectedImage(null);
      setPreviewImage(null);
    }
  }, [props.open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("price", formData.price.toString());
      formDataToSubmit.append("stock", formData.stock.toString());

      if (selectedImage) {
        formDataToSubmit.append("image", selectedImage);
      }

      const response = await axios.post(
        "http://localhost:4000/api/products",
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product created:", response.data);
      props.setOpen(false);
      props.onProductAdded();
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error al crear producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={props.open}
      onOpenChange={() => {
        props.setOpen(false);
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-linear-to-br from-green-50 to-emerald-50 border-0 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader className="pb-4 border-b border-green-100">
            <DialogTitle className="text-2xl font-bold bg-linear-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ➕ Agregar Producto
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              Completa la información para agregar un nuevo producto. Todos los
              campos son obligatorios.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {previewImage && (
              <div className="grid gap-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Vista Previa de la Imagen
                </Label>
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-green-200">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label
                htmlFor="image"
                className="text-sm font-semibold text-gray-700"
              >
                Imagen del Producto *
              </Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="border-green-200 focus:border-green-400 focus:ring-green-400 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Nombre del Producto *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-green-200 focus:border-green-400 focus:ring-green-400 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5"
                placeholder="Nombre del producto"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="price"
                className="text-sm font-semibold text-gray-700"
              >
                Precio (USD) *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
                className="border-green-200 focus:border-green-400 focus:ring-green-400 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5"
                placeholder="0.00"
              />
            </div>

            {/* Stock */}
            <div className="grid gap-2">
              <Label
                htmlFor="stock"
                className="text-sm font-semibold text-gray-700"
              >
                Stock *
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
                className="border-green-200 focus:border-green-400 focus:ring-green-400 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5"
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4 border-t border-green-100">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-medium"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-linear-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-green-500/30 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H4c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creando...
                </span>
              ) : (
                "➕ Crear Producto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
