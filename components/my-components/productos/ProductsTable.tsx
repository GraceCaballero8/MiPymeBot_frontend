"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Edit2, Trash2, Plus } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  user_id: number;
  user: {
    id: number;
    role_id: number;
    email: string;
    full_name?: string;
    dni: string;
    ruc: string | null;
    business_name: string | null;
  };
}

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
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

  const getColorClass = (index: number) => {
    const colors = [
      { bg: "bg-blue-100", badge: "bg-blue-500" },
      { bg: "bg-indigo-100", badge: "bg-indigo-500" },
      { bg: "bg-cyan-100", badge: "bg-cyan-500" },
      { bg: "bg-gray-100", badge: "bg-gray-500" },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Productos</h2>
          <p className="text-gray-600 mt-1">
            Gestiona el inventario de productos ({products.length})
          </p>
        </div>
        <button
          onClick={() => toast("Agregar producto - Por implementar")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        {loading ? (
          <div className="text-center py-8">Cargando productos...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay productos registrados
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product, index) => {
              const colors = getColorClass(index);

              return (
                <div
                  key={product.id}
                  className={`${colors.bg} border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-all duration-300 group`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-20 h-20 rounded-lg ${colors.badge} flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden`}
                    >
                      <img
                        src={`http://localhost:4000/images/products/${product.id}.png`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (
                            parent &&
                            !parent.querySelector(".fallback-initial")
                          ) {
                            const span = document.createElement("span");
                            span.textContent = product.name
                              .charAt(0)
                              .toUpperCase();
                            span.className = "fallback-initial";
                            parent.appendChild(span);
                          }
                        }}
                      />
                      <span className="fallback-initial">
                        {product.name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-800">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        📧 {product.user.email}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        🏢{" "}
                        {product.user.business_name ||
                          product.user.full_name ||
                          "Sin nombre"}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs font-medium bg-white text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                          💰 ${product.price}
                        </span>
                        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 shadow-sm">
                          📦 Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        toast("Edición de producto - Por implementar");
                      }}
                      className="p-2.5 hover:bg-white rounded-lg transition-all duration-200 group-hover:scale-105 border border-gray-200 hover:shadow-sm"
                    >
                      <Edit2 size={18} className="text-indigo-600" />
                    </button>
                    <button
                      onClick={() => {
                        toast("Eliminación de producto - Por implementar");
                      }}
                      className="p-2.5 hover:bg-white rounded-lg transition-all duration-200 group-hover:scale-105 border border-gray-200 hover:shadow-sm"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
