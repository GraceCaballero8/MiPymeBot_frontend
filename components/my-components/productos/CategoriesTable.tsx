"use client";

import { useState } from "react";
import { Category } from "@/app/interfaces/product.interface";
import { Edit2, Trash2, Plus } from "lucide-react";
import { DialogCategoryAdd } from "./DialogCategoryAdd"; 
import { DialogCategoryEdit } from "./DialogCategoryEdit";
import { DialogCategoryDelete } from "./DialogCategoryDelete";

interface CategoriesTableProps {
  categories: Category[];
  loading: boolean;
  onRefresh: () => void;
}

export function CategoriesTable({ categories, loading, onRefresh }: CategoriesTableProps) {
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const getIconClass = (icon: string, color: string) => {
    const colorClasses = {
      blue: "bg-blue-100 text-blue-600",
      red: "bg-red-100 text-red-600",
      yellow: "bg-yellow-100 text-yellow-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
    };
    
    return colorClasses[color as keyof typeof colorClasses] || "bg-gray-100 text-gray-600";
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Categorías de Productos</h3>
        <button
          onClick={() => setOpenDialogAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Agregar categoría
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar categorías..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <i className="fas fa-search"></i>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
                  </div>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No hay categorías registradas
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${getIconClass(category.icon, category.color)}`}>
                        <i className={`fas ${category.icon}`}></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {/* Aquí iría el conteo de productos por categoría */}
                    0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      category.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setCategoryToEdit(category);
                        setOpenDialogEdit(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setCategoryToDelete(category);
                        setOpenDialogDelete(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {openDialogAdd && (
        <DialogCategoryAdd
          open={openDialogAdd}
          setOpen={setOpenDialogAdd}
          onRefresh={onRefresh}
        />
      )}

      {openDialogEdit && categoryToEdit && (
        <DialogCategoryEdit
          open={openDialogEdit}
          setOpen={setOpenDialogEdit}
          category={categoryToEdit}
          onRefresh={onRefresh}
        />
      )}

      {openDialogDelete && categoryToDelete && (
        <DialogCategoryDelete
          open={openDialogDelete}
          setOpen={setOpenDialogDelete}
          category={categoryToDelete}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}