"use client";

import { SideBar } from "@/components/my-components/SideBar";

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
