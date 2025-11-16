"use client";

import { SideBar } from "@/components/my-components/SideBar";
import { AuthContextProvider } from "@/context/auth-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
