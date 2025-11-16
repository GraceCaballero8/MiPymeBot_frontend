"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Company } from "@/app/interfaces/company.interface";
import useFetchApi from "@/hooks/use-fetch";

export function CompanyForm() {
  const { get, patch } = useFetchApi();
  const [company, setCompany] = useState<Partial<Company>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  async function fetchCompanyData() {
    setLoading(true);
    try {
      const data = await get<Company>("/company/my");
      if (data) {
        setCompany(data);
      }
    } catch (error) {
      toast.error("Error al cargar los datos de la empresa");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!company.id) {
      toast.error("No tienes una empresa asociada");
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading("Guardando cambios...");

    try {
      // Enviar solo los campos editables (sin id, admin_id, timestamps, etc.)
      const updateData = {
        name: company.name,
        ruc: company.ruc,
        sector: company.sector,
        phone: company.phone,
        address: company.address,
        description: company.description,
        logo_url: company.logo_url,
      };

      await patch<Company, typeof updateData>(
        `/company/${company.id}`,
        updateData
      );
      toast.success("¡Empresa actualizada exitosamente!", { id: loadingToast });
      fetchCompanyData();
    } catch (error: any) {
      let errorMessage = "Error al actualizar empresa";

      // Manejar diferentes tipos de respuesta de error
      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        // Si es un array de errores de validación
        if (Array.isArray(msg)) {
          errorMessage = msg.join(", ");
        }
        // Si es un objeto con constraints (error de class-validator)
        else if (typeof msg === "object" && msg.constraints) {
          errorMessage = Object.values(msg.constraints).join(", ");
        }
        // Si es un string simple
        else if (typeof msg === "string") {
          errorMessage = msg;
        }
      }

      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Mi Tienda</h2>
        <p className="text-gray-600 mt-1">Configura los datos de tu negocio</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        {/* Header con logo */}
        <div className="flex items-center mb-6 pb-6 border-b">
          <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden mr-6">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="text-gray-400 text-3xl font-bold">
                {company.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-800">
              {company.name || "Nombre de la tienda"}
            </h3>
            <p className="text-sm text-gray-500">
              RUC: {company.ruc || "no registrado"}
            </p>
            <button
              type="button"
              className="mt-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              Cambiar logo de la tienda
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre de la tienda *
              </label>
              <input
                type="text"
                name="name"
                value={company.name || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">RUC</label>
              <input
                type="text"
                name="ruc"
                value={company.ruc || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rubro *</label>
              <input
                type="text"
                name="sector"
                value={company.sector || ""}
                onChange={handleChange}
                placeholder="Ej: Tecnología, Alimentos, etc."
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Teléfono / WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                value={company.phone || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                value={company.address || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Descripción del negocio
              </label>
              <textarea
                name="description"
                value={company.description || ""}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                URL del logo
              </label>
              <input
                type="url"
                name="logo_url"
                value={company.logo_url || ""}
                onChange={handleChange}
                placeholder="https://ejemplo.com/logo.png"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
