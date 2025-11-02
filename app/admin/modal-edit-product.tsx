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
  product: any;
  setProductToUpdate: Function;
};

export function DialogProductUpdate(props: props) {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: props.product?.name || "",
    price: props.product?.price || 0,
    stock: props.product?.stock || 0,
  });

  useEffect(() => {
    if (props.open && props.product) {
      setFormData({
        name: props.product.name || "",
        price: props.product.price || 0,
        stock: props.product.stock || 0,
      });
      setSelectedImage(null);
      setPreviewImage(null);
    }
  }, [props.open, props.product]);

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

      const response = await axios.patch(
        `http://localhost:4000/api/products/${props.product.id}`,
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product updated:", response.data);
      props.setOpen(false);
      props.setProductToUpdate(null);
      window.location.reload();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error al actualizar producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={props.open}
      onOpenChange={() => {
        props.setOpen(false);
        props.setProductToUpdate(null);
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-linear-to-br from-blue-50 to-cyan-50 border-0 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader className="pb-4 border-b border-blue-100">
            <DialogTitle className="text-2xl font-bold bg-linear-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              ✏️ Editar Producto
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              Modifica la información del producto. Los cambios se guardarán
              cuando hagas clic en Guardar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* Company Info */}
            <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                🏢 Información de la Empresa
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Empresa:</span>{" "}
                  {props.product?.user?.business_name ||
                    props.product?.user?.full_name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span>{" "}
                  {props.product?.user?.email}
                </p>
              </div>
            </div>

            {/* Product Image Preview */}
            {(previewImage || props.product?.id) && (
              <div className="grid gap-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Imagen del Producto
                </Label>
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-blue-200">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={`http://localhost:4000/images/products/${props.product.id}.png`}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (
                          parent &&
                          !parent.querySelector(".fallback-initial")
                        ) {
                          const span = document.createElement("span");
                          span.textContent = "📦";
                          span.className =
                            "fallback-initial w-full h-full flex items-center justify-center text-4xl bg-blue-100";
                          parent.appendChild(span);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Product Image Upload */}
            <div className="grid gap-2">
              <Label
                htmlFor="image"
                className="text-sm font-semibold text-gray-700"
              >
                Cambiar Imagen
              </Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
            </div>

            {/* Product Name */}
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Nombre del Producto
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5"
                placeholder="Nombre del producto"
              />
            </div>

            {/* Price */}
            <div className="grid gap-2">
              <Label
                htmlFor="price"
                className="text-sm font-semibold text-gray-700"
              >
                Precio (USD)
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
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5"
                placeholder="0.00"
              />
            </div>

            {/* Stock */}
            <div className="grid gap-2">
              <Label
                htmlFor="stock"
                className="text-sm font-semibold text-gray-700"
              >
                Stock
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5"
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4 border-t border-blue-100">
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
              className="bg-linear-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all duration-200"
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
                  Guardando...
                </span>
              ) : (
                "💾 Guardar cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
