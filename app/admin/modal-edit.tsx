"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type props = {
  open: boolean;
  setOpen: Function;
  user: any;
  setUserToUpdate: Function;
};

interface Role {
  id: number;
  name: string;
  alias: string;
}

export function DialogUserUpdate(props: props) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<number>(
    props.user?.role_id || 1
  );
  const [isCompany, setIsCompany] = useState(props.user.role === "company");

  const [formData, setFormData] = useState({
    email: props.user?.email || "",
    full_name: props.user?.full_name || "",
    dni: props.user?.dni || "",
    ruc: props.user?.ruc || "",
    business_name: props.user?.business_name || "",
  });

  useEffect(() => {
    if (props.open && props.user) {
      setFormData({
        email: props.user.email || "",
        full_name: props.user.full_name || "",
        dni: props.user.dni || "",
        ruc: props.user.ruc || "",
        business_name: props.user.business_name || "",
      });
      setSelectedRole(props.user.role_id);
      setIsCompany(props.user.role?.name === "company");
    }
  }, [props.open, props.user]);

  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRoles(response.data.filter((role: any) => role.name !== "admin"));
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleId = parseInt(e.target.value);
    setSelectedRole(roleId);

    const role = roles.find((r) => r.id === roleId);
    setIsCompany(role?.name === "company");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const dataToSubmit = {
        email: formData.email,
        full_name: formData.full_name,
        dni: formData.dni,
        role_id: selectedRole,
        ...(isCompany && {
          ruc: formData.ruc,
          business_name: formData.business_name,
        }),
        ...(!isCompany && {
          ruc: null,
          business_name: null,
        }),
      };

      const response = await axios.patch(
        `http://localhost:4000/api/users/${props.user.id}`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("User updated:", response.data);
      props.setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error al actualizar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={props.open}
      onOpenChange={() => {
        props.setOpen(false);
        props.setUserToUpdate(null);
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-linear-to-br from-purple-50 to-pink-50 border-0 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader className="pb-4 border-b border-purple-100">
            <DialogTitle className="text-2xl font-bold bg-linear-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ✏️ Editar Usuario
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              Modifica la información del usuario. Los cambios se guardarán
              cuando hagas clic en Guardar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="full_name"
                className="text-sm font-semibold text-gray-700"
              >
                Nombre Completo
              </Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="dni"
                className="text-sm font-semibold text-gray-700"
              >
                DNI
              </Label>
              <Input
                id="dni"
                name="dni"
                type="text"
                value={formData.dni}
                onChange={handleChange}
                required
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="role_id"
                className="text-sm font-semibold text-gray-700"
              >
                Rol
              </Label>
              <select
                id="role_id"
                value={selectedRole}
                onChange={handleRoleChange}
                className="w-full px-4 py-2.5 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/70 backdrop-blur-sm text-gray-800 font-medium transition-all"
                required
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.alias}
                  </option>
                ))}
              </select>
            </div>

            {isCompany && (
              <div className="mt-2 p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <p className="text-sm font-semibold text-blue-700 mb-4">
                  📋 Información de la Empresa
                </p>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="ruc"
                      className="text-sm font-semibold text-gray-700"
                    >
                      RUC
                    </Label>
                    <Input
                      id="ruc"
                      name="ruc"
                      type="text"
                      value={formData.ruc}
                      onChange={handleChange}
                      required
                      placeholder="1234567890"
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="business_name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Razón Social
                    </Label>
                    <Input
                      id="business_name"
                      name="business_name"
                      type="text"
                      value={formData.business_name}
                      onChange={handleChange}
                      required
                      placeholder="My Business"
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3 pt-4 border-t border-purple-100">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-medium"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-linear-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-pink-500/30 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H4c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Guardando...
                </span>
              ) : (
                "💾 Guardar cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
