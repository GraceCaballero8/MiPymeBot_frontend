"use client";

import { useEffect, useState, Suspense } from "react";
import {
  Trash2,
  Edit2,
  Plus,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";
import axios from "axios";
import { DialogProductUpdate } from "../admin/modal-edit-product";
import { DialogProductDelete } from "../admin/modal-delete-product";
import { DialogProductAdd } from "./modal-add-product";
import { useSearchParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  user_id: number;
}

interface Order {
  id: number;
  product_id: number;
  quantity: number;
  status: string;
  created_at: string;
  user: {
    id: number;
    full_name: string;
    email: string;
  };
  product: Product;
}

interface Client {
  id: number;
  full_name: string;
  email: string;
  total_orders: number;
}

function CompanyDashboardContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "products";

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [openDialogProductUpdate, setOpenDialogProductUpdate] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);
  const [openDialogProductDelete, setOpenDialogProductDelete] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [openDialogProductAdd, setOpenDialogProductAdd] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchProducts() {
    setLoadingProducts(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const [userResponse, productsResponse] = await Promise.all([
        axios.get("http://localhost:4000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:4000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCompanyName(
        userResponse.data.business_name || userResponse.data.full_name
      );
      setProducts(productsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function fetchOrders() {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await axios.get(
        "http://localhost:4000/api/products/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(response.data);

      const clientsMap = new Map();
      response.data.forEach((order: Order) => {
        if (order.user) {
          const clientId = order.user.id;
          if (!clientsMap.has(clientId)) {
            clientsMap.set(clientId, {
              id: clientId,
              full_name: order.user.full_name,
              email: order.user.email,
              total_orders: 1,
            });
          } else {
            clientsMap.get(clientId).total_orders++;
          }
        }
      });
      setClients(Array.from(clientsMap.values()));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    if (view === "orders" || view === "clients") {
      fetchOrders();
    }
  }, [view]);

  const handleProductAdded = () => {
    fetchProducts();
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-6 p-6 min-h-screen">
      <div className="w-64 shrink-0 bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-white/50 shadow-lg h-fit sticky top-6">
        <div className="space-y-2">
          <a
            href="?view=products"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === "products"
                ? "bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-white/50"
            }`}
          >
            <Package size={20} />
            <span className="font-semibold">Mis Productos</span>
          </a>
          <a
            href="?view=orders"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === "orders"
                ? "bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-white/50"
            }`}
          >
            <ShoppingCart size={20} />
            <span className="font-semibold">Mis Pedidos</span>
          </a>
          <a
            href="?view=clients"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === "clients"
                ? "bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-white/50"
            }`}
          >
            <Users size={20} />
            <span className="font-semibold">Mis Clientes</span>
          </a>
        </div>
        <div className="mt-6 pt-6 border-t border-white/30">
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white/50 w-full transition-all"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            <span className="text-lg">🚪</span>
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex justify-between bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-white/50 shadow-lg">
          <div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
              🏢 {companyName}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {view === "products"
                ? "Gestiona tus productos"
                : view === "orders"
                ? "Gestiona los pedidos recibidos"
                : "Visualiza tus clientes"}
            </p>
          </div>
          {view === "products" && (
            <button
              onClick={() => setOpenDialogProductAdd(true)}
              className="flex items-center gap-2 px-4 py-2 h-fit bg-linear-to-br from-blue-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              Add Product
            </button>
          )}
        </div>

        {view === "products" && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos por nombre..."
                  className="flex-1 bg-transparent border-0 focus:outline-none text-gray-700 placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {loadingProducts ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500"></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredProducts.length === 0 ? (
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/50">
                    <p className="text-gray-500">
                      {products.length === 0
                        ? "No tienes productos publicados"
                        : "No se encontraron productos con ese nombre"}
                    </p>
                  </div>
                ) : (
                  filteredProducts.map((product, index) => {
                    const pastelColors = [
                      "from-blue-100 to-cyan-100",
                      "from-purple-100 to-pink-100",
                      "from-green-100 to-emerald-100",
                      "from-yellow-100 to-orange-100",
                      "from-rose-100 to-pink-100",
                    ];
                    const colorIndex = index % pastelColors.length;

                    return (
                      <div
                        key={product.id}
                        className={`bg-linear-to-br ${pastelColors[colorIndex]} border border-white/50 rounded-2xl p-5 flex items-center justify-between hover:shadow-xl transition-all duration-300 group backdrop-blur-sm`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-20 h-20 rounded-lg bg-linear-to-br ${
                              colorIndex === 0
                                ? "from-blue-400 to-cyan-400"
                                : colorIndex === 1
                                ? "from-purple-400 to-pink-400"
                                : colorIndex === 2
                                ? "from-green-400 to-emerald-400"
                                : colorIndex === 3
                                ? "from-yellow-400 to-orange-400"
                                : "from-rose-400 to-pink-400"
                            } flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden`}
                          >
                            <img
                              src={`http://localhost:4000/images/products/${product.id}.png`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const parent = e.currentTarget.parentElement;
                                if (
                                  parent &&
                                  !parent.querySelector(".fallback-initial")
                                ) {
                                  const span = document.createElement("span");
                                  span.textContent = product.name
                                    .charAt(0)
                                    .toUpperCase();
                                  span.className = "fallback-initial";
                                  parent.appendChild(span);
                                }
                              }}
                            />
                            <span className="fallback-initial">
                              {product.name.charAt(0).toUpperCase()}
                            </span>
                          </div>

                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-800">
                              {product.name}
                            </h4>
                            <div className="flex gap-2 mt-3">
                              <span className="text-xs font-medium bg-white/70 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full border border-white/50 shadow-sm">
                                💰 ${product.price}
                              </span>
                              <span className="text-xs font-medium bg-blue-100/70 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 shadow-sm">
                                📦 Stock: {product.stock}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setProductToUpdate(product);
                              setOpenDialogProductUpdate(true);
                            }}
                            className="p-2.5 hover:bg-white/60 backdrop-blur-sm rounded-xl transition-all duration-200 group-hover:scale-105 border border-white/30 hover:shadow-md"
                          >
                            <Edit2 size={18} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => {
                              setProductToDelete(product);
                              setOpenDialogProductDelete(true);
                            }}
                            className="p-2.5 hover:bg-white/60 backdrop-blur-sm rounded-xl transition-all duration-200 group-hover:scale-105 border border-white/30 hover:shadow-md"
                          >
                            <Trash2 size={18} className="text-pink-500" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {view === "orders" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Pedidos Recibidos ({orders.length})
            </h3>

            {loadingOrders ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500"></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {orders.length === 0 ? (
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/50">
                    <p className="text-gray-500">
                      No has recibido pedidos todavía
                    </p>
                  </div>
                ) : (
                  orders.map((order, index) => {
                    const pastelColors = [
                      "from-blue-100 to-cyan-100",
                      "from-purple-100 to-pink-100",
                      "from-green-100 to-emerald-100",
                      "from-yellow-100 to-orange-100",
                      "from-rose-100 to-pink-100",
                    ];
                    const colorIndex = index % pastelColors.length;

                    return (
                      <div
                        key={order.id}
                        className={`bg-linear-to-br ${pastelColors[colorIndex]} border border-white/50 rounded-2xl p-4 backdrop-blur-sm`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div>
                              <h4 className="font-bold text-gray-800">
                                {order.product.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Cliente: {order.user?.full_name || "N/A"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.user?.email || ""}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Cantidad: {order.quantity} |{" "}
                                {new Date(
                                  order.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-white/70 backdrop-blur-sm rounded-full border border-white/50 text-sm font-medium">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {view === "clients" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Mis Clientes ({clients.length})
            </h3>

            <div className="grid gap-4">
              {clients.length === 0 ? (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/50">
                  <p className="text-gray-500">No tienes clientes todavía</p>
                </div>
              ) : (
                clients.map((client, index) => {
                  const pastelColors = [
                    "from-purple-100 to-pink-100",
                    "from-blue-100 to-cyan-100",
                    "from-green-100 to-emerald-100",
                    "from-yellow-100 to-orange-100",
                    "from-rose-100 to-pink-100",
                  ];
                  const colorIndex = index % pastelColors.length;

                  return (
                    <div
                      key={client.id}
                      className={`bg-linear-to-br ${pastelColors[colorIndex]} border border-white/50 rounded-2xl p-5 flex items-center justify-between hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-14 h-14 rounded-full bg-linear-to-br ${
                            colorIndex === 0
                              ? "from-purple-400 to-pink-400"
                              : colorIndex === 1
                              ? "from-blue-400 to-cyan-400"
                              : colorIndex === 2
                              ? "from-green-400 to-emerald-400"
                              : colorIndex === 3
                              ? "from-yellow-400 to-orange-400"
                              : "from-rose-400 to-pink-400"
                          } flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                        >
                          {client.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-800">
                            {client.full_name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {client.email}
                          </p>
                          <span className="text-xs font-medium bg-white/70 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full border border-white/50 shadow-sm mt-2 inline-block">
                            🛒 {client.total_orders} pedidos
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {openDialogProductAdd && (
          <DialogProductAdd
            open={openDialogProductAdd}
            setOpen={setOpenDialogProductAdd}
            onProductAdded={handleProductAdded}
          />
        )}

        {openDialogProductUpdate && productToUpdate && (
          <DialogProductUpdate
            open={openDialogProductUpdate}
            setOpen={setOpenDialogProductUpdate}
            product={productToUpdate}
            setProductToUpdate={setProductToUpdate}
          />
        )}

        {openDialogProductDelete && productToDelete && (
          <DialogProductDelete
            open={openDialogProductDelete}
            setOpen={setOpenDialogProductDelete}
            product={productToDelete}
            setProductToDelete={setProductToDelete}
          />
        )}
      </div>
    </div>
  );
}

export default function CompanyDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyDashboardContent />
    </Suspense>
  );
}
