"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Store,
  Package,
  Building2,
  UserCircle,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    href: "/admin/perfil",
    label: "Mi Perfil",
    icon: UserCircle,
  },
  {
    href: "/admin/mi-tienda",
    label: "Mi Tienda",
    icon: Store,
  },
  {
    href: "/admin/vendedores",
    label: "Vendedores",
    icon: Users,
  },
  {
    href: "/admin/empresas",
    label: "Empresas",
    icon: Building2,
  },
  {
    href: "/admin/productos",
    label: "Productos",
    icon: Package,
  },
];

export function SideBar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Admin Panel
        </h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
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
