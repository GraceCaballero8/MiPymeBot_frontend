"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Store,
  Package,
  Building2,
  UserCircle,
  NotepadText,
  ChartColumnIncreasingIcon,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

const menuItems = [
  {
    href: "/admin/perfil",
    label: "Mi Perfil",
    icon: UserCircle,
    role: ["admin", "vendedor"],
  },
  {
    href: "/admin/mi-tienda",
    label: "Mi Tienda",
    icon: Store,
    role: ["admin"], // Solo admin
  },
  {
    href: "/admin/vendedores",
    label: "Vendedores",
    icon: Users,
    role: ["admin"], // Solo admin
  },
  {
    href: "/admin/productos",
    label: "Productos",
    icon: Package,
    role: ["admin", "vendedor"],
  },
  {
    href: "/admin/movimientos",
    label: "Movimientos",
    icon: NotepadText,
    role: ["admin", "vendedor"],
  },
  {
    href: "/admin/inventario",
    label: "Inventario",
    icon: ChartColumnIncreasingIcon,
    role: ["admin", "vendedor"],
  },
];

export function SideBar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Filtrar items del menú según el rol del usuario
  const filteredMenuItems = menuItems.filter((item) => {
    if (!user?.role?.name) return false;
    return item.role.includes(user.role.name);
  });

  // Mostrar loading mientras se carga el usuario
  if (isLoading) {
    return (
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Cargando...
          </h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <Users className="w-6 h-6" />
          {user?.role?.name === "admin" ? "Panel Admin" : "Panel Vendedor"}
        </h1>
        {user && (
          <p className="text-sm text-gray-600 mt-2">
            {user.first_name} {user.last_name_paternal}
          </p>
        )}
      </div>

      <nav className="space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 mt-8 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </aside>
  );
}
