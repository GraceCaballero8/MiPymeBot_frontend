"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [isCompany, setIsCompany] = useState(false);

  const [roles, setRoles] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name_paternal: "",
    last_name_maternal: "",
    dni: "",
    dni_verifier: "",
    birth_date: "",
    gender: "MASCULINO" as "MASCULINO" | "FEMENINO",
  });

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      console.log("Login:", { email: loginEmail, password: loginPassword });
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email: loginEmail,
          password: loginPassword,
        }
      );

      console.log(response);
      // Backend devuelve { user, token } en login
      const token = response.data.token || response.data.accessToken;
      localStorage.setItem("token", token);
      const userRole = response.data.user.role;

      if (userRole === "admin") {
        window.location.href = "/admin?view=profile";
      } else if (userRole === "vendor" || userRole === "seller") {
        window.location.href = "/company?view=profile";
      } else if (userRole === "client") {
        window.location.href = "/client?view=profile";
      } else {
        alert("Rol no reconocido");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // exacto al auth.DTO
      const payload = {
        email: registerData.email,
        password: registerData.password,
        first_name: registerData.first_name,
        last_name_paternal: registerData.last_name_paternal,
        last_name_maternal: registerData.last_name_maternal,
        dni: registerData.dni,
        dni_verifier: registerData.dni_verifier,
        birth_date: registerData.birth_date,
        gender: registerData.gender,
      };

      const response = await axios.post(
        "http://localhost:4000/api/auth/register",
        payload
      );
      const { accessToken } = response.data;

      localStorage.setItem("token", accessToken);
      window.location.href = "/admin?view=profile";
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  async function valiteSession() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await axios.get("http://localhost:4000/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const role = response.data.role.name;
    if (role === "admin") {
      window.location.href = "/admin?view=profile";
    } else if (role === "client") {
      window.location.href = "/client?view=profile";
    } else if (role === "company") {
      window.location.href = "/company?view=profile";
    }
  }

  useEffect(() => {
    fetchRoles();
    valiteSession();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-zinc-900">
        {/* Toggle between Login and Register */}
        <div className="flex gap-4 mb-6 border-b dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`pb-3 px-2 font-medium transition-colors ${
              isLogin
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            {loading ? "Iniciando Sesión" : "Iniciar Sesión"}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`pb-3 px-2 font-medium transition-colors ${
              !isLogin
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            {loading ? "Registrando" : "Registro"}
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium mb-2 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium mb-2 dark:text-gray-300"
              >
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                placeholder="tu@email.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 dark:text-gray-300"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            {/* NOMBRES */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium mb-2 dark:text-gray-300"
                >
                  Nombres
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={registerData.first_name}
                  onChange={handleRegisterChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                  placeholder="Juan"
                />
              </div>
              <div>
                <label
                  htmlFor="last_name_paternal"
                  className="block text-sm font-medium mb-2 dark:text-gray-300"
                >
                  Ap. Paterno
                </label>
                <input
                  id="last_name_paternal"
                  name="last_name_paternal"
                  type="text"
                  value={registerData.last_name_paternal}
                  onChange={handleRegisterChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                  placeholder="Pérez"
                />
              </div>
              <div>
                <label
                  htmlFor="last_name_maternal"
                  className="block text-sm font-medium mb-2 dark:text-gray-300"
                >
                  Ap. Materno
                </label>
                <input
                  id="last_name_maternal"
                  name="last_name_maternal"
                  type="text"
                  value={registerData.last_name_maternal}
                  onChange={handleRegisterChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                  placeholder="López"
                />
              </div>
            </div>

            {/* DNI + DÍGITO VERIFICADOR */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="dni"
                  className="block text-sm font-medium mb-2 dark:text-gray-300"
                >
                  DNI
                </label>
                <input
                  id="dni"
                  name="dni"
                  type="text"
                  value={registerData.dni}
                  onChange={handleRegisterChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                  placeholder="12345678"
                  maxLength={8}
                />
              </div>
              <div>
                <label
                  htmlFor="dni_verifier"
                  className="block text-sm font-medium mb-2 dark:text-gray-300"
                >
                  Dígito
                </label>
                <input
                  id="dni_verifier"
                  name="dni_verifier"
                  type="text"
                  value={registerData.dni_verifier}
                  onChange={handleRegisterChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                  placeholder="5"
                  maxLength={1}
                />
              </div>
            </div>

            {/* FECHA DE NACIMIENTO */}
            <div>
              <label
                htmlFor="birth_date"
                className="block text-sm font-medium mb-2 dark:text-gray-300"
              >
                Fecha de nacimiento
              </label>
              <input
                id="birth_date"
                name="birth_date"
                type="date"
                value={registerData.birth_date}
                onChange={handleRegisterChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>

            {/* GÉNERO */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium mb-2 dark:text-gray-300"
              >
                Género
              </label>
              <select
                id="gender"
                name="gender"
                value={registerData.gender}
                onChange={handleRegisterChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              >
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </select>
            </div>

            {/* BOTÓN */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Registrarse
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
