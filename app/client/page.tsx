"use client";

import { useEffect, useState, Suspense } from "react";
import { MessageSquare, ShoppingCart, Package, Sparkles } from "lucide-react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  user_id: number;
  user: {
    id: number;
    email: string;
    full_name: string;
    business_name: string | null;
  };
}

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

interface Order {
  id: number;
  product_id: number;
  quantity: number;
  status: string;
  created_at: string;
  product: Product;
}

function ClientDashboardContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "products";

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);

  async function fetchProducts() {
    setLoadingProducts(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await axios.get("http://localhost:4000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
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

      const response = await axios.get("http://localhost:4000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  }

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
    setShowOrderModal(true);
    setOrderQuantity(1);
  };

  const handleOrderSubmit = async () => {
    if (!selectedProduct) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/orders",
        {
          product_id: selectedProduct.id,
          quantity: orderQuantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Pedido realizado por ${orderQuantity} ${selectedProduct.name}`);
      setShowOrderModal(false);
      setSelectedProduct(null);
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error al realizar el pedido");
    }
  };

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: aiQuery };
    setChatMessages((prev) => [...prev, userMessage]);
    setAiQuery("");
    setLoadingAI(true);

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        role: "ai",
        content: `Basándome en los productos disponibles, aquí está mi respuesta sobre "${
          userMessage.content
        }": Hay ${
          products.length
        } productos disponibles con precios que van desde $${Math.min(
          ...products.map((p) => p.price)
        )} hasta $${Math.max(...products.map((p) => p.price))}.`,
      };

      setChatMessages((prev) => [...prev, aiMessage]);
      setLoadingAI(false);
    }, 1000);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <div className="flex gap-6 p-6 min-h-screen">
      <div className="w-64 shrink-0 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-white/50 shadow-lg h-fit sticky top-6">
        <div className="space-y-2">
          <a
            href="?view=products"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === "products"
                ? "bg-linear-to-br from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-white/50"
            }`}
          >
            <ShoppingCart size={20} />
            <span className="font-semibold">Productos</span>
          </a>
          <a
            href="?view=orders"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === "orders"
                ? "bg-linear-to-br from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-white/50"
            }`}
          >
            <Package size={20} />
            <span className="font-semibold">Mis Pedidos</span>
          </a>
          <a
            href="?view=ai"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === "ai"
                ? "bg-linear-to-br from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-white/50"
            }`}
          >
            <Sparkles size={20} />
            <span className="font-semibold">IA</span>
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

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-white/50 shadow-lg">
          <h2 className="text-3xl font-bold bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Cliente Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            {view === "products"
              ? "Explora y encuentra los mejores productos"
              : view === "orders"
              ? "Gestiona tus pedidos"
              : "Consulta con IA sobre los productos"}
          </p>
        </div>

        {view === "products" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Productos Disponibles ({products.length})
            </h3>

            {loadingProducts ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500"></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {products.length === 0 ? (
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/50">
                    <p className="text-gray-500">
                      No hay productos disponibles
                    </p>
                  </div>
                ) : (
                  products.map((product, index) => {
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
                        key={product.id}
                        className={`bg-linear-to-br ${pastelColors[colorIndex]} border border-white/50 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
                      >
                        <div className="flex items-center gap-3 justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {/* Product Image */}
                            <div
                              className={`w-16 h-16 rounded-lg bg-linear-to-br ${
                                colorIndex === 0
                                  ? "from-purple-400 to-pink-400"
                                  : colorIndex === 1
                                  ? "from-blue-400 to-cyan-400"
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

                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-base text-gray-800 truncate">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-600 truncate">
                                🏢{" "}
                                {product.user.business_name ||
                                  product.user.full_name}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs font-medium bg-white/70 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full border border-white/50 shadow-sm">
                                  💰 ${product.price}
                                </span>
                                <span className="text-xs font-medium bg-green-100/70 text-green-700 px-2 py-1 rounded-full border border-green-200 shadow-sm">
                                  📦 {product.stock} disponibles
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleOrderClick(product)}
                            className="px-4 py-2 bg-linear-to-br from-blue-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-all font-semibold"
                          >
                            🛒 Pedir
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
            <h3 className="text-2xl font-bold bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Mis Pedidos ({orders.length})
            </h3>

            {loadingOrders ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500"></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {orders.length === 0 ? (
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/50">
                    <p className="text-gray-500">
                      No tienes pedidos realizados
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
                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="font-bold text-gray-800">
                                {order.product.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Cantidad: {order.quantity}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
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

        {view === "ai" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              🤖 Asistente IA
            </h3>

            <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-white/50 shadow-lg h-[600px] flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <p className="text-2xl mb-2">🤖</p>
                    <p>Haz una pregunta sobre los productos disponibles</p>
                  </div>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-3 ${
                          msg.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-white/70 backdrop-blur-sm text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {loadingAI && (
                  <div className="flex justify-start">
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H4c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Pensando...
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAIQuery()}
                  placeholder="Pregunta sobre los productos..."
                  className="flex-1 bg-white/70 backdrop-blur-sm border border-emerald-200 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  onClick={handleAIQuery}
                  disabled={loadingAI}
                  className="px-5 py-3 bg-linear-to-br from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <MessageSquare size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {showOrderModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Realizar Pedido</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">{selectedProduct.name}</p>
                  <p className="text-sm text-gray-600">
                    Precio: ${selectedProduct.price}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.stock}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleOrderSubmit}
                    className="flex-1 px-4 py-2 bg-linear-to-br from-blue-500 to-cyan-500 text-white rounded-lg hover:opacity-90"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientDashboardContent />
    </Suspense>
  );
}
