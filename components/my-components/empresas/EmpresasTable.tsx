"use client";

import { useEffect, useState } from "react";
import { Company } from "@/app/interfaces/company.interface";
import toast, { Toaster } from "react-hot-toast";
import { Edit2, Trash2, Search } from "lucide-react";
import useFetchApi from "@/hooks/use-fetch";

export function EmpresasTable() {
  const { get } = useFetchApi();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    setLoading(true);
    try {
      const data = await get<Company[]>("/company");
      const companiesData = Array.isArray(data) ? data : [];
      setCompanies(companiesData.filter((c: any) => c?.name));
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Error al cargar las empresas");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredCompanies = companies.filter((company) =>
    company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Empresas</h2>
          <p className="text-gray-600 mt-1">
            Listado de todas las empresas registradas
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar empresas por nombre..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">Cargando empresas...</div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {companies.length === 0
              ? "No hay empresas registradas"
              : "No se encontraron empresas con ese nombre"}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-indigo-50 border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 h-20 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>{company.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-800">
                      {company.name}
                    </h4>
                    <p className="text-sm text-gray-600">{company.sector}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      RUC: {company.ruc || "No registrado"}
                    </p>
                    {company.phone && (
                      <p className="text-xs text-gray-500">
                        📞 {company.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      toast("Edición de empresa - Por implementar");
                    }}
                    className="p-2.5 hover:bg-white rounded-lg transition-all border border-gray-200"
                  >
                    <Edit2 size={18} className="text-indigo-600" />
                  </button>
                  <button
                    onClick={() => {
                      toast("Eliminación de empresa - Por implementar");
                    }}
                    className="p-2.5 hover:bg-white rounded-lg transition-all border border-gray-200"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
