// components/my-components/productos/Product/ProductsTabs.tsx
"use client";

import { useState } from "react";

interface ProductsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ProductsTabs({ activeTab, setActiveTab }: ProductsTabsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "categories"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Categorías
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "products"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab("suppliers")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "suppliers"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Proveedores
          </button>
        </nav>
      </div>
    </div>
  );
}