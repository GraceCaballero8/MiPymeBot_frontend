// components/my-components/productos/Product/ProductosPage.tsx
"use client";

import { useState, useEffect } from "react";
import { Product, Category, Supplier } from "@/app/interfaces/product.interface";
import { ProductsTabs } from "./ProductsTabs";
import { ProductsTable } from "./ProductsTable";
import { CategoriesTable } from "../Category/CategoriesTable";
import { SuppliersTable } from "../Supplier/SuppliersTable";
import axios from "axios";

export default function ProductosPage() {
  const [activeTab, setActiveTab] = useState("productos");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      // Obtener categorías
      const categoriesResponse = await axios.get("http://localhost:4000/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(categoriesResponse.data);

      // Obtener productos
      const productsResponse = await axios.get("http://localhost:4000/api/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(productsResponse.data);

      // Obtener proveedores
      const suppliersResponse = await axios.get("http://localhost:4000/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuppliers(suppliersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <div className="flex space-x-2">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
            Importar
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            Exportar
          </button>
        </div>
      </div>
      
      <ProductsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "categorias" && (
        <CategoriesTable 
          categories={categories} 
          loading={loading} 
          onRefresh={fetchData} 
        />
      )}
      
      {activeTab === "productos" && (
        <ProductsTable 
          products={products} 
          loading={loading} 
          onRefresh={fetchData} 
        />
      )}
      
      {activeTab === "proveedores" && (
        <SuppliersTable 
          suppliers={suppliers} 
          loading={loading} 
          onRefresh={fetchData} 
        />
      )}
    </div>
  );
}