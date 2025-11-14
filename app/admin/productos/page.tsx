"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Product, Category, Supplier } from "@/app/interfaces/product.interface";
import { ProductsTabs } from "../../../components/my-components/productos/Product/ProductsTabs";
import { CategoriesTable } from "@/components/my-components/productos/Category/CategoriesTable";
import { ProductsTable } from "../../../components/my-components/productos/Product/ProductsTable";
import { SuppliersTable } from "@/components/my-components/productos/Supplier/SuppliersTable";
import toast, { Toaster } from 'react-hot-toast';


export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      console.log("Enviando petición a /api/products");
      const response = await axios.get("http://localhost:4000/api/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Respuesta de productos:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error detallado:", error);
      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      console.log("Enviando petición a /api/categories");
      const response = await axios.get("http://localhost:4000/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Respuesta de categorías:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error detallado:", error);
      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);
      }
    }
  };

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      console.log("Enviando petición a /api/suppliers");
      const response = await axios.get("http://localhost:4000/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Respuesta de proveedores:", response.data);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error detallado:", error);
      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  return (
    <div className="space-y-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gestión de Productos</h2>
        <p className="text-gray-600 mt-1">Administra tus productos, categorías y proveedores</p>
      </div>

      <ProductsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "categories" && (
        <CategoriesTable
          categories={categories}
          loading={loadingCategories}
          onRefresh={fetchCategories}
        />
      )}

      {activeTab === "products" && (
        <ProductsTable
          products={products}
          loading={loadingProducts}
          onRefresh={fetchProducts}
        />
      )}

      {activeTab === "suppliers" && (
        <SuppliersTable
          suppliers={suppliers}
          loading={loadingSuppliers}
          onRefresh={fetchSuppliers}
        />
      )}
    </div>
  );
}