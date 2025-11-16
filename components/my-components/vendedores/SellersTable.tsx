"use client";

import { useEffect, useState } from "react";
import { Seller } from "@/app/interfaces/seller.interface";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Search, Trash2, Edit2, Users } from "lucide-react";
import { SellerAddModal } from "./SellerAddModal";
import { SellerEditModal } from "./SellerEditModal";
import { SellerDeleteModal } from "./SellerDeleteModal";
import useFetchApi from "@/hooks/use-fetch";

export function SellersTable() {
  const { get } = useFetchApi();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  useEffect(() => {
    fetchSellers();
  }, []);

  async function fetchSellers() {
    setLoading(true);
    try {
      const data = await get<Seller[]>("/users/sellers");
      setSellers(data || []);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      toast.error("Error al cargar los vendedores");
      setSellers([]);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (seller: Seller) => {
    setSelectedSeller(seller);
    setOpenEditModal(true);
  };

  const handleDelete = (seller: Seller) => {
    setSelectedSeller(seller);
    setOpenDeleteModal(true);
  };

  const filteredSellers = sellers.filter((seller) => {
    const fullName =
      `${seller.first_name} ${seller.last_name_paternal} ${seller.last_name_maternal}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      seller.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.dni?.includes(searchQuery);

    const matchesStatus =
      statusFilter === "ALL" || seller.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeSellers = sellers.filter((s) => s.status === "ACTIVE").length;
  const inactiveSellers = sellers.filter((s) => s.status === "INACTIVE").length;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Vendedores</h2>
          <p className="text-gray-600 mt-1">
            Gestiona los vendedores de tu empresa
          </p>
        </div>
        <button
          onClick={() => setOpenAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Agregar vendedor
        </button>
      </div>
      {/* Estadísticas - Siempre visibles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total vendedores</p>
              <p className="text-2xl font-bold text-gray-900">
                {sellers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Vendedores activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeSellers}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Vendedores inactivos</p>
              <p className="text-2xl font-bold text-gray-900">
                {inactiveSellers}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar vendedores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="ALL">Todos los estados</option>
            <option value="ACTIVE">Activos</option>
            <option value="INACTIVE">Inactivos</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">Cargando vendedores...</div>
        ) : filteredSellers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay vendedores registrados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vendedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    DNI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {seller.first_name} {seller.last_name_paternal}{" "}
                          {seller.last_name_maternal}
                        </div>
                        <div className="text-sm text-gray-500">
                          {seller.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {seller.dni}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {seller.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          seller.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {seller.status === "ACTIVE" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(seller)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(seller)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SellerAddModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={fetchSellers}
      />

      {selectedSeller && (
        <>
          <SellerEditModal
            open={openEditModal}
            seller={selectedSeller}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedSeller(null);
            }}
            onSuccess={fetchSellers}
          />

          <SellerDeleteModal
            open={openDeleteModal}
            seller={selectedSeller}
            onClose={() => {
              setOpenDeleteModal(false);
              setSelectedSeller(null);
            }}
            onSuccess={fetchSellers}
          />
        </>
      )}
    </div>
  );
}
