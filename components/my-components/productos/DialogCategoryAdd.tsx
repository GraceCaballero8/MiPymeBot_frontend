"use client";

import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

interface DialogCategoryAddProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRefresh: () => void;
}

export function DialogCategoryAdd({ open, setOpen, onRefresh }: DialogCategoryAddProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "fa-box",
    color: "blue",
    status: "active" as "active" | "inactive",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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

      const response = await axios.post(
        "http://localhost:4000/api/categories",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOpen(false);
      onRefresh();
      setFormData({
        name: "",
        description: "",
        icon: "fa-box",
        color: "blue",
        status: "active",
      });
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Agregar Nueva Categoría</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ej: Frutas y Verduras"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Descripción de la categoría"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                    Icono
                  </label>
                  <select
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="fa-apple-alt">Manzana</option>
                    <option value="fa-drumstick-bite">Carne</option>
                    <option value="fa-bread-slice">Pan</option>
                    <option value="fa-fish">Pescado</option>
                    <option value="fa-cheese">Queso</option>
                    <option value="fa-egg">Huevo</option>
                    <option value="fa-cookie">Galleta</option>
                    <option value="fa-carrot">Zanahoria</option>
                    <option value="fa-bacon">Jamón</option>
                    <option value="fa-birthday-cake">Pastel</option>
                    <option value="fa-box">Caja</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <select
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="blue">Azul</option>
                    <option value="red">Rojo</option>
                    <option value="yellow">Amarillo</option>
                    <option value="green">Verde</option>
                    <option value="purple">Morado</option>
                    <option value="orange">Naranja</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Guardar categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}