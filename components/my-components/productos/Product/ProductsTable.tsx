"use client";

import { useState } from "react";
import { Product } from "@/app/interfaces/product.interface";
import { Edit2, Trash2, Plus } from "lucide-react";
import { DialogProductAdd } from "./DialogProductAdd";
import { DialogProductEdit } from "./DialogProductEdit";
import { DialogProductDelete } from "./DialogProductDelete";

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onRefresh: () => void;
}

export function ProductsTable({ products, loading, onRefresh }: ProductsTableProps) {
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? product.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      "Frutas y Verduras": "fa-apple-alt",
      "Carnes y Aves": "fa-drumstick-bite",
      "Panadería": "fa-bread-slice",
      "Lácteos": "fa-cheese",
      "Snacks y Golosinas": "fa-cookie",
    };
    
    return iconMap[categoryName] || "fa-box";
  };

  const getCategoryColor = (categoryName: string) => {
    const colorMap: { [key: string]: string } = {
      "Frutas y Verduras": "blue",
      "Carnes y Aves": "red",
      "Panadería": "yellow",
      "Lácteos": "purple",
      "Snacks y Golosinas": "green",
    };
    
    return colorMap[categoryName] || "gray";
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Lista de Productos</h3>
        <button
          onClick={() => setOpenDialogAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Agregar producto
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div className="relative flex-grow md:mr-4 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <i className="fas fa-search"></i>
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3 md:mb-0 md:mr-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Products List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
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
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
                  </div>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  {searchQuery || statusFilter
                    ? "No se encontraron productos con los filtros aplicados"
                    : "No hay productos registrados"}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className={`h-10 w-10 rounded-full bg-${getCategoryColor(product.category_id || "")}-100 flex items-center justify-center text-${getCategoryColor(product.category_id || "")}-600 mr-3`}>
                          <i className={`fas ${getCategoryIcon(product.category_id || "")}`}></i>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    S/. {product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock} {product.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setProductToEdit(product);
                        setOpenDialogEdit(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setProductToDelete(product);
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
        <DialogProductAdd
          open={openDialogAdd}
          setOpen={setOpenDialogAdd}
          onRefresh={onRefresh}
        />
      )}

      {openDialogEdit && productToEdit && (
        <DialogProductEdit
          open={openDialogEdit}
          setOpen={setOpenDialogEdit}
          product={productToEdit}
          onRefresh={onRefresh}
        />
      )}

      {openDialogDelete && productToDelete && (
        <DialogProductDelete
          open={openDialogDelete}
          setOpen={setOpenDialogDelete}
          product={productToDelete}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}