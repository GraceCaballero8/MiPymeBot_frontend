"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Product, Category, Supplier } from "@/app/interfaces/product.interface";
import { ProductsTabs } from "../../../components/my-components/productos/ProductsTabs";
import { CategoriesTable } from "../../../components/my-components/productos/CategoriesTable";
import { ProductsTable } from "../../../components/my-components/productos/ProductsTable";
import { SuppliersTable } from "../../../components/my-components/productos/SuppliersTable";
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
    setLoadingProducts(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await axios.get("http://localhost:4000/api/products", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error al cargar los productos");
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await axios.get("http://localhost:4000/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error al cargar las categorías");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSuppliers = async () => {
    setLoadingSuppliers(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await axios.get("http://localhost:4000/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("Error al cargar los proveedores");
    } finally {
      setLoadingSuppliers(false);
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