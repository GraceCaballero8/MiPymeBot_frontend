"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Package, Plus, Edit, X } from "lucide-react";
import {
  Product,
  ProductGroup,
  UnitOfMeasure,
  CreateProductDto,
} from "@/app/interfaces/product.interface";

export function ProductsForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [groups, setGroups] = useState<ProductGroup[]>([]);
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<CreateProductDto>({
    sku: "",
    name: "",
    unit_id: 0,
    group_id: 0,
    min_stock: 0,
    price: undefined,
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    unit_id: 0,
    group_id: 0,
    min_stock: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchGroups();
    fetchUnits();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await axios.get("http://localhost:4000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error al cargar los productos");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchGroups() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/products/groups",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGroups(response.data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }

  async function fetchUnits() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/products/units",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUnits(response.data || []);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !formData.sku ||
      !formData.name ||
      !formData.unit_id ||
      !formData.group_id
    ) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:4000/api/products", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Producto registrado exitosamente");

      // Limpiar formulario
      setFormData({
        sku: "",
        name: "",
        unit_id: 0,
        group_id: 0,
        min_stock: 0,
        price: undefined,
      });

      // Recargar productos
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(
        error.response?.data?.message || "Error al guardar el producto"
      );
    } finally {
      setSubmitting(false);
    }
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      unit_id: product.unit_id,
      group_id: product.group_id,
      min_stock: product.min_stock,
    });
    setShowEditModal(true);
  }

  function closeEditModal() {
    setShowEditModal(false);
    setEditingProduct(null);
    setEditFormData({
      name: "",
      unit_id: 0,
      group_id: 0,
      min_stock: 0,
    });
  }

  async function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!editingProduct) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:4000/api/products/${editingProduct.id}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Producto actualizado exitosamente");
      closeEditModal();
      fetchProducts();
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(
        error.response?.data?.message || "Error al actualizar el producto"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Gestión de Productos
        </h2>
        <p className="text-gray-600 mt-1">
          Registra y administra tus productos
        </p>
      </div>

      {/* Formulario de Registro */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-600" />
          Registrar Nuevo Producto
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Código (SKU) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sku: e.target.value.toUpperCase(),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                placeholder="PT0002"
                required
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="POLO BASICO TALLA M"
                required
              />
            </div>

            {/* Unidad de Medida */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad de Medida <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.unit_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unit_id: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value={0}>Seleccionar...</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.abbreviation})
                  </option>
                ))}
              </select>
            </div>

            {/* Grupo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grupo <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.group_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    group_id: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value={0}>Seleccionar...</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stock Mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Mínimo <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.min_stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_stock: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="50"
                required
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {submitting ? "Registrando..." : "Registrar Producto"}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Productos Registrados ({products.length})
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-12">Cargando productos...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p>No hay productos registrados</p>
            <p className="text-sm mt-1">
              Usa el formulario de arriba para crear tu primer producto
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grupo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Mín
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-gray-900">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {product.group?.name || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.unit?.abbreviation || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {product.min_stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => openEditModal(product)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Edit className="w-6 h-6 text-blue-600" />
                Editar Producto
              </h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">
              {/* SKU (solo lectura) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código (no editable)
                </label>
                <input
                  type="text"
                  value={editingProduct.sku}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 font-mono"
                />
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Unidad de Medida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidad de Medida <span className="text-red-500">*</span>
                </label>
                <select
                  value={editFormData.unit_id}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      unit_id: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value={0}>Seleccionar...</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.abbreviation})
                    </option>
                  ))}
                </select>
              </div>

              {/* Grupo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo <span className="text-red-500">*</span>
                </label>
                <select
                  value={editFormData.group_id}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      group_id: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value={0}>Seleccionar...</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Mínimo <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={editFormData.min_stock}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      min_stock: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 font-medium"
                >
                  {submitting ? "Actualizando..." : "Actualizar Producto"}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
