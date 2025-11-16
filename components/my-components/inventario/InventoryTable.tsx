"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { RefreshCw, FileDown, AlertTriangle, Package } from "lucide-react";
import { InventoryStatus } from "@/app/interfaces/inventory.interface";

export function InventoryTable() {
  const [inventory, setInventory] = useState<InventoryStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<
    "ALL" | "Sin Stock" | "Stock Bajo" | "Stock OK"
  >("ALL");

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await axios.get(
        "http://localhost:4000/api/inventory/status",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setInventory(response.data || []);
      toast.success("Inventario actualizado");
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Error al cargar el inventario");
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Código",
      "Nombre",
      "Unidad",
      "Grupo",
      "Stock Mínimo",
      "Stock Actual",
      "Estado",
    ];
    const rows = filteredInventory.map((item) => [
      item.codigo,
      item.nombre,
      item.unidad,
      item.grupo,
      item.stock_minimo,
      item.stock_actual,
      item.estado,
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n"
    );

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventario_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Inventario exportado a CSV");
  };

  const filteredInventory = inventory.filter((item) => {
    if (filter === "ALL") return true;
    return item.estado === filter;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Sin Stock":
        return "bg-red-100 border-red-200 text-red-700";
      case "Stock Bajo":
        return "bg-yellow-100 border-yellow-200 text-yellow-700";
      case "Stock OK":
        return "bg-green-100 border-green-200 text-green-700";
      default:
        return "bg-gray-100 border-gray-200 text-gray-700";
    }
  };

  const sinStock = inventory.filter((i) => i.estado === "Sin Stock").length;
  const stockBajo = inventory.filter((i) => i.estado === "Stock Bajo").length;
  const stockOK = inventory.filter((i) => i.estado === "Stock OK").length;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Control de Inventario
          </h2>
          <p className="text-gray-600 mt-1">
            Visualiza el stock actual de tus productos
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchInventory}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            Actualizar Stock
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <FileDown className="w-5 h-5" />
            Exportar CSV
          </button>
          <button
            onClick={() =>
              setFilter(filter === "Stock Bajo" ? "ALL" : "Stock Bajo")
            }
            className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
          >
            <AlertTriangle className="w-5 h-5" />
            Solo Alertas
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3">
            <Package className="w-10 h-10 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Total Productos
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {inventory.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Stock OK</p>
              <p className="text-2xl font-bold text-green-700">{stockOK}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-10 h-10 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">Stock Bajo</p>
              <p className="text-2xl font-bold text-yellow-700">{stockBajo}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
              ✕
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Sin Stock</p>
              <p className="text-2xl font-bold text-red-700">{sinStock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-lg transition ${
            filter === "ALL"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Todos ({inventory.length})
        </button>
        <button
          onClick={() => setFilter("Stock OK")}
          className={`px-4 py-2 rounded-lg transition ${
            filter === "Stock OK"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Stock OK ({stockOK})
        </button>
        <button
          onClick={() => setFilter("Stock Bajo")}
          className={`px-4 py-2 rounded-lg transition ${
            filter === "Stock Bajo"
              ? "bg-yellow-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Stock Bajo ({stockBajo})
        </button>
        <button
          onClick={() => setFilter("Sin Stock")}
          className={`px-4 py-2 rounded-lg transition ${
            filter === "Sin Stock"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Sin Stock ({sinStock})
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
            <p className="text-gray-600 mt-2">Cargando inventario...</p>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p>No hay productos en el inventario</p>
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
                    Unidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grupo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Mín.
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Actual
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map((item, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 transition ${
                      item.estado === "Sin Stock"
                        ? "bg-red-50"
                        : item.estado === "Stock Bajo"
                        ? "bg-yellow-50"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-semibold text-gray-900">
                        {item.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {item.nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {item.unidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.grupo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-600">
                        {item.stock_minimo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-bold text-gray-900">
                        {item.stock_actual}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(
                          item.estado
                        )}`}
                      >
                        {item.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => {
                          window.location.href = `/admin/movimientos?sku=${item.codigo}`;
                        }}
                        className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                      >
                        Ver Kardex
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
