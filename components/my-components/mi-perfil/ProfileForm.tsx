"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/app/interfaces/profile.interface";
import toast, { Toaster } from "react-hot-toast";
import useFetchApi from "@/hooks/use-fetch";

export function ProfileForm() {
  const { get, patch } = useFetchApi();
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    get<Profile>("/profile")
      .then((data) => {
        setForm({
          first_name: data.first_name,
          last_name_paternal: data.last_name_paternal,
          last_name_maternal: data.last_name_maternal,
          dni: data.dni,
          birth_date: data.birth_date?.split("T")[0],
          gender: data.gender,
          phone: data.phone || "",
          address: data.address || "",
          profile_image: data.profile_image || "",
          email: data.email,
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error al cargar el perfil");
        setLoading(false);
      });
  }, [get]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    const loadingToast = toast.loading("Guardando cambios...");
    try {
      const updateData = {
        first_name: form.first_name,
        last_name_paternal: form.last_name_paternal,
        last_name_maternal: form.last_name_maternal,
        phone: form.phone || undefined,
        address: form.address || undefined,
        birth_date: form.birth_date,
        gender: form.gender,
        profile_image: form.profile_image || undefined,
      };

      await patch<Profile, typeof updateData>("/profile", updateData);
      toast.success("¡Perfil actualizado exitosamente!", {
        id: loadingToast,
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Error al guardar los cambios",
        {
          id: loadingToast,
          duration: 4000,
        }
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Cargando perfil...</div>;

  const getInitials = () => {
    const firstName = form.first_name || "";
    const lastName = form.last_name_paternal || "";
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Mi Perfil</h2>
        <p className="text-gray-600 mt-1">Gestiona tu información personal</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center mb-6">
          {form.profile_image ? (
            <img
              src={form.profile_image}
              alt="Avatar"
              className="h-20 w-20 rounded-full object-cover border-2 border-indigo-200 mr-6"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 text-2xl font-bold mr-6">
              {getInitials()}
            </div>
          )}
          <div>
            <h3 className="text-xl font-medium text-gray-800">
              {form.first_name} {form.last_name_paternal}{" "}
              {form.last_name_maternal}
            </h3>
            <p className="text-gray-500">{form.email}</p>
            <button className="mt-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium">
              Cambiar foto de perfil
            </button>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombres
              </label>
              <input
                type="text"
                name="first_name"
                value={form.first_name || ""}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido Paterno
              </label>
              <input
                type="text"
                name="last_name_paternal"
                value={form.last_name_paternal || ""}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido Materno
              </label>
              <input
                type="text"
                name="last_name_maternal"
                value={form.last_name_maternal || ""}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI
              </label>
              <input
                type="text"
                name="dni"
                value={form.dni || ""}
                readOnly
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                name="birth_date"
                value={form.birth_date || ""}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Género
              </label>
              <select
                name="gender"
                value={form.gender || ""}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono / WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <textarea
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                rows={2}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Imagen de Perfil
              </label>
              <input
                type="url"
                name="profile_image"
                value={form.profile_image || ""}
                onChange={handleChange}
                placeholder="https://ejemplo.com/mi-foto.jpg"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ingresa la URL de tu imagen de perfil
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4 text-gray-800">
              Configuración de cuenta
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={form.email || ""}
                  readOnly
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  El correo electrónico no se puede modificar
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
