"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Profile } from "../interfaces/profile.interface";
import toast, { Toaster } from 'react-hot-toast';

export default function ProfileSection() {
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const data = res.data;
        setForm({
          first_name: data.first_name,
          last_name_paternal: data.last_name_paternal,
          last_name_maternal: data.last_name_maternal,
          dni: data.dni,
          dni_verifier: data.dni_verifier,
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
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    const loadingToast = toast.loading('Guardando cambios...');
    try {
      await axios.patch(
        "http://localhost:4000/api/profile",
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success('¡Perfil actualizado exitosamente!', {
        id: loadingToast,
        duration: 3000,
      });
    } catch {
      toast.error('Error al guardar los cambios', {
        id: loadingToast,
        duration: 4000,
      });
    } finally {
      setSaving(false);
    }
  };
  


  if (loading) return <div className="p-6">Cargando perfil...</div>;

  // Obtener iniciales para el avatar si no hay imagen
  const getInitials = () => {
    const firstName = form.first_name || "";
    const lastName = form.last_name_paternal || "";
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  

  return (
    <div className="space-y-6">
        <Toaster 
      position="top-right"
      toastOptions={{
        // ... opciones del toast
      }}
    />
    
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
              {form.first_name} {form.last_name_paternal} {form.last_name_maternal}
            </h3>
            <p className="text-gray-500">{form.email}</p>
            <button className="mt-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium">
              <i className="fas fa-camera mr-1"></i> Cambiar foto de perfil
            </button>
          </div>
        </div>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
              <input 
                type="text" 
                id="first-name" 
                name="first_name" 
                value={form.first_name || ""}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
              <input 
                type="text" 
                id="last-name" 
                name="last_name_paternal" 
                value={form.last_name_paternal || ""}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
            <div>
              <label htmlFor="last-name-maternal" className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
              <input 
                type="text" 
                id="last-name-maternal" 
                name="last_name_maternal" 
                value={form.last_name_maternal || ""}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
              <input 
                type="text" 
                id="dni" 
                name="dni" 
                value={form.dni || ""}
                onChange={handleChange}
                readOnly
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-500" 
              />
            </div>
            <div>
              <label htmlFor="birth-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
              <input 
                type="date" 
                id="birth-date" 
                name="birth_date" 
                value={form.birth_date || ""}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Género</label>
              <select 
                id="gender" 
                name="gender" 
                value={form.gender || ""}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono / WhatsApp</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={form.phone || ""}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <textarea 
                id="address" 
                name="address" 
                value={form.address || ""}
                onChange={handleChange}
                rows={2}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Configuración de cuenta</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={form.email || ""}
                  onChange={handleChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Dejar en blanco para mantener la contraseña actual" 
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button" 
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}