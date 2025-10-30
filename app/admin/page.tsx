"use client";

import { useEffect, useState, Suspense } from "react";
import { Trash2, Edit2, Users as UsersIcon, Package, Plus } from "lucide-react";
import axios from "axios";
import { DialogUserUpdate } from "./modal-edit";
import { DialogUserDelete } from "./modal-delete";
import { DialogProductUpdate } from "./modal-edit-product";
import { DialogProductDelete } from "./modal-delete-product";
import { useSearchParams } from "next/navigation";
import { Company } from '../interfaces/company.interface';
import { DialogCompanyAdd } from "./modal-add-company";
import ProfileSection from "./profile";
import { Profile } from "../interfaces/profile.interface";
import toast, { Toaster } from 'react-hot-toast';
import { Seller } from "../interfaces/seller.interface";



interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  user_id: number;
  user: {
    id: number;
    role_id: number;
    email: string;
    full_name: string;
    dni: string;
    ruc: string | null;
    business_name: string | null;
  };
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "sellers";

  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [openDialogUpdate, setOpenDialogUpdate] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<any>(null);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [openDialogProductUpdate, setOpenDialogProductUpdate] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);
  const [openDialogProductDelete, setOpenDialogProductDelete] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [openDialogCompanyAdd, setOpenDialogCompanyAdd] = useState(false);
  const [openDialogCompanyUpdate, setOpenDialogCompanyUpdate] = useState(false);
  const [companyToUpdate, setCompanyToUpdate] = useState<Company | null>(null);
  const [openDialogCompanyDelete, setOpenDialogCompanyDelete] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<Partial<Profile>>({});
  const [companyData, setCompanyData] = useState<Partial<Company>>({
    name: "",
    ruc: "",
    address: "",
    description: "",
    logo_url: "",
    phone: "",
    sector: ""
  });
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);


  //Estado para vendedores
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [openDialogSellerAdd, setOpenDialogSellerAdd] = useState(false);
  const [openDialogSellerUpdate, setOpenDialogSellerUpdate] = useState(false);
  const [sellerToUpdate, setSellerToUpdate] = useState<Seller | null>(null);
  const [openDialogSellerDelete, setOpenDialogSellerDelete] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState<Seller | null>(null);
  const [sellerForm, setSellerForm] = useState<Partial<Seller>>({
    first_name: "",
    last_name_paternal: "",
    last_name_maternal: "",
    email: "",
    phone: "",
    dni: "",
    start_date: new Date().toISOString().split('T')[0],
    points: 0,
    status: 'active'
  });
  const [savingSeller, setSavingSeller] = useState(false);

  const filteredCompanies = companies.filter(company =>
    company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await axios.patch(
        "http://localhost:4000/api/profile",
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMessage("✅ Perfil actualizado");
    } catch {
      setMessage("❌ Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  async function fetchUsers() {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
      }
      const response = await axios.get("http://localhost:4000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  }

  async function fetchCompanies() {
    setLoadingCompanies(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await axios.get("http://localhost:4000/api/company/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const validCompanies = (response.data || []).filter((c: any) => c?.name);
      setCompanies(validCompanies);

      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoadingCompanies(false);
    }
  }

  //Cargar datos de la empresa
  async function fetchCompanyData() {
    setLoadingCompany(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await axios.get("http://localhost:4000/api/company/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.length > 0) {
        // Si ya existe una empresa, carga sus datos
        setCompanyData(response.data[0]);
      } else {
        // Si no hay empresa, deja los campos vacíos
        setCompanyData({
          name: "",
          ruc: "",
          address: "",
          description: "",
          logo_url: "",
          phone: "",
          sector: ""
        });
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      toast.error("Error al cargar los datos de la empresa");
    } finally {
      setLoadingCompany(false);
    }
  }

  // Guardar datos de la empresa
  const handleSaveCompany = async () => {
    setSavingCompany(true);
    
    const loadingToast = toast.loading('Guardando datos de la empresa...');
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      let response;
      
      // Si ya existe una empresa (tiene id), actualiza
      if (companyData.id) {
        response = await axios.patch(
          `http://localhost:4000/api/company/${companyData.id}`,
          companyData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Si no existe, créala
        response = await axios.post(
          "http://localhost:4000/api/company",
          companyData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      // Actualiza los datos con la respuesta del servidor
      setCompanyData(response.data);
      
      toast.success('¡Datos de la empresa guardados exitosamente!', {
        id: loadingToast,
        duration: 3000,
      });
    } catch (error) {
      toast.error('Error al guardar los datos de la empresa', {
        id: loadingToast,
        duration: 4000,
      });
    } finally {
      setSavingCompany(false);
    }
  };

  const handleCompanyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setCompanyData({ ...companyData, [e.target.name]: e.target.value });

  // Modifica el useEffect para cargar los datos de la empresa
  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchCompanies();
    fetchCompanyData(); 
  }, []);

  async function fetchProducts() {
    setLoadingProducts(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
      }
      const response = await axios.get("http://localhost:4000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  }

  // Función para cargar vendedores
  async function fetchSellers() {
    setLoadingSellers(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }
      const response = await axios.get("http://localhost:4000/api/sellers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSellers(response.data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      toast.error("Error al cargar los vendedores");
    } finally {
      setLoadingSellers(false);
    }
  }

  // Función para manejar cambios en el formulario de vendedor
  const handleSellerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setSellerForm({ ...sellerForm, [e.target.name]: e.target.value });

  // Función para guardar un vendedor (nuevo o existente)
  const handleSaveSeller = async () => {
    setSavingSeller(true);
    
    const loadingToast = toast.loading(sellerForm.id ? 'Actualizando vendedor...' : 'Agregando vendedor...');
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      let response;
      
      // Si ya existe un vendedor (tiene id), actualízalo
      if (sellerForm.id) {
        response = await axios.patch(
          `http://localhost:4000/api/sellers/${sellerForm.id}`,
          sellerForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Si no existe, créalo
        response = await axios.post(
          "http://localhost:4000/api/sellers",
          sellerForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      // Actualiza la lista de vendedores
      if (sellerForm.id) {
        setSellers(sellers.map(seller => 
          seller.id === sellerForm.id ? response.data : seller
        ));
      } else {
        setSellers([...sellers, response.data]);
      }
      
      // Cierra el modal y resetea el formulario
      setOpenDialogSellerAdd(false);
      setOpenDialogSellerUpdate(false);
      setSellerForm({
        first_name: "",
        last_name_paternal: "",
        last_name_maternal: "",
        email: "",
        phone: "",
        dni: "",
        start_date: new Date().toISOString().split('T')[0],
        points: 0,
        status: 'active'
      });
      
      toast.success(sellerForm.id ? '¡Vendedor actualizado exitosamente!' : '¡Vendedor agregado exitosamente!', {
        id: loadingToast,
        duration: 3000,
      });
    } catch (error) {
      toast.error('Error al guardar el vendedor', {
        id: loadingToast,
        duration: 4000,
      });
    } finally {
      setSavingSeller(false);
    }
  };

  // Función para eliminar un vendedor
  const handleDeleteSeller = async () => {
    if (!sellerToDelete) return;
    
    const loadingToast = toast.loading('Eliminando vendedor...');
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }
      
      await axios.delete(
        `http://localhost:4000/api/sellers/${sellerToDelete.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Actualiza la lista de vendedores
      setSellers(sellers.filter(seller => seller.id !== sellerToDelete.id));
      
      // Cierra el modal
      setOpenDialogSellerDelete(false);
      setSellerToDelete(null);
      
      toast.success('¡Vendedor eliminado exitosamente!', {
        id: loadingToast,
        duration: 3000,
      });
    } catch (error) {
      toast.error('Error al eliminar el vendedor', {
        id: loadingToast,
        duration: 4000,
      });
    }
  };

  // Función para cambiar el estado de un vendedor
  const toggleSellerStatus = async (seller: Seller) => {
    const newStatus = seller.status === 'active' ? 'inactive' : 'active';
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }
      
      const response = await axios.patch(
        `http://localhost:4000/api/sellers/${seller.id}`,
        { ...seller, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Actualiza la lista de vendedores
      setSellers(sellers.map(s => 
        s.id === seller.id ? response.data : s
      ));
      
      toast.success(`Vendedor ${newStatus === 'active' ? 'activado' : 'desactivado'} exitosamente`);
    } catch (error) {
      toast.error(`Error al ${newStatus === 'active' ? 'activar' : 'desactivar'} el vendedor`);
    }
  };

  // Modifica el useEffect para cargar los vendedores
  useEffect(() => {
    fetchSellers();
    fetchProducts();
    fetchCompanies();
    fetchCompanyData(); 
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchCompanies();
  }, []);

  return (
    <div className="flex gap-6 p-6 min-h-screen bg-gray-50">

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

      {/* Sidebar */}
      <div className="w-64 shrink-0 bg-white rounded-xl p-4 border border-gray-200 shadow-md h-fit sticky top-6">
        <div className="p-4 mb-4">
          <div className="flex items-center">
            <div className="text-xl font-bold text-indigo-600">
              <UsersIcon size={24} className="inline mr-2" />Admin Panel
            </div>
          </div>
        </div>
        
        <div className="space-y-2">

          <a
            href="?view=profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              view === "profile"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <UsersIcon size={20} />
            <span className="font-medium">Mi Perfil</span>
          </a>
          <a
            href="?view=store"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              view === "store"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Package size={20} />
            <span className="font-medium">Mi Tienda</span>
          </a>
          
          <a
            href="?view=sellers"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              view === "sellers"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <UsersIcon size={20} />
            <span className="font-medium">Vendedores</span>
          </a>
          <a
            href="?view=companies"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              view === "companies"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <UsersIcon size={20} />
            <span className="font-medium">Empresas</span>
          </a>
          <a
            href="?view=products"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              view === "products"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Package size={20} />
            <span className="font-medium">Productos</span>
          </a>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full transition-all"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            <span className="text-lg">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {/*<div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Admin Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {view === "users" ? "Manage all users" : "Manage all products"}
          </p>
        </div>*/}

        
        {view === "profile" && <ProfileSection />}

        {view === "store" && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Mi Tienda</h2>
              <p className="text-gray-600 mt-1">Configura los datos de tu negocio</p>
            </div>
            
            {loadingCompany ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center mb-6">
                  {companyData.logo_url ? (
                    <img
                      src={companyData.logo_url}
                      alt="Logo de la tienda"
                      className="h-20 w-20 rounded-lg object-cover border-2 border-indigo-200 mr-6"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-gray-200 flex items-center justify-center mr-6">
                      <i className="fas fa-store text-gray-500 text-2xl"></i>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">
                      {companyData.name || "Nombre de la tienda"}
                    </h3>
                    <p className="text-gray-500">{companyData.ruc || "RUC no registrado"}</p>
                    <button className="mt-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                      <i className="fas fa-camera mr-1"></i> Cambiar logo de la tienda
                    </button>
                  </div>
                </div>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la tienda *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={companyData.name || ""}
                        onChange={handleCompanyChange}
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                    </div>
                    <div>
                      <label htmlFor="ruc" className="block text-sm font-medium text-gray-700 mb-1">RUC</label>
                      <input 
                        type="text" 
                        id="ruc" 
                        name="ruc" 
                        value={companyData.ruc || ""}
                        onChange={handleCompanyChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                    </div>
                    <div>
                      <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">Rubro *</label>
                      <select 
                        id="sector" 
                        name="sector" 
                        value={companyData.sector || ""}
                        onChange={handleCompanyChange}
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Seleccionar rubro</option>
                        <option value="alimentos">Alimentos</option>
                        <option value="moda">Moda</option>
                        <option value="servicios">Servicios</option>
                        <option value="tecnologia">Tecnología</option>
                        <option value="hogar">Hogar</option>
                        <option value="salud">Salud</option>
                        <option value="educacion">Educación</option>
                        <option value="otros">Otros</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono / WhatsApp</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={companyData.phone || ""}
                        onChange={handleCompanyChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                      <input 
                        type="text" 
                        id="address" 
                        name="address" 
                        value={companyData.address || ""}
                        onChange={handleCompanyChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción del negocio</label>
                      <textarea 
                        id="description" 
                        name="description" 
                        rows={3} 
                        value={companyData.description || ""}
                        onChange={handleCompanyChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-1">URL del logo</label>
                      <input 
                        type="text" 
                        id="logo_url" 
                        name="logo_url" 
                        value={companyData.logo_url || ""}
                        onChange={handleCompanyChange}
                        placeholder="https://ejemplo.com/logo.png"
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                    </div>
                  </div>
                  
                  {/*<div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4 text-gray-800">Redes Sociales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                        <input 
                          type="text" 
                          id="facebook" 
                          name="facebook" 
                          value={companyData.facebook || ""}
                          onChange={handleCompanyChange}
                          placeholder="https://facebook.com/tutienda" 
                          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                      </div>
                      <div>
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                        <input 
                          type="text" 
                          id="instagram" 
                          name="instagram" 
                          value={companyData.instagram || ""}
                          onChange={handleCompanyChange}
                          placeholder="@tutienda" 
                          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                      </div>
                    </div>
                  </div>*/}
                  
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      onClick={handleSaveCompany}
                      disabled={savingCompany}
                      className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {savingCompany ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Vista de Vendedores */}
        {view === "sellers" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Vendedores</h2>
              <button
                onClick={() => setOpenDialogSellerAdd(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={18} />
                Agregar vendedor
              </button>
            </div>
            
            {/* Barra de búsqueda y filtro */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between">
              <div className="relative flex-grow md:mr-4 mb-4 md:mb-0">
                <input 
                  type="text" 
                  placeholder="Buscar vendedores..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <i className="fas fa-search"></i>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">Todos los estados</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>
            
            {/* Tabla de Vendedores */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de ingreso</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingSellers ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
                          </div>
                        </td>
                      </tr>
                    ) : sellers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No hay vendedores registrados
                        </td>
                      </tr>
                    ) : (
                      sellers.map((seller) => {
                        const fullName = `${seller.first_name} ${seller.last_name_paternal} ${seller.last_name_maternal}`;
                        const initials = `${seller.first_name.charAt(0)}${seller.last_name_paternal.charAt(0)}`.toUpperCase();
                        
                        return (
                          <tr key={seller.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {seller.profile_image ? (
                                  <img
                                    src={seller.profile_image}
                                    alt={fullName}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                                    {initials}
                                  </div>
                                )}
                                <div className="ml-4">
                                  <p className="text-sm font-medium text-gray-900">{fullName}</p>
                                  <p className="text-sm text-gray-500">{seller.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(seller.start_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900">{seller.points}</span>
                                <i className="fas fa-trophy text-yellow-500 ml-2"></i>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                seller.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {seller.status === 'active' ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => {
                                  setSellerToUpdate(seller);
                                  setSellerForm(seller);
                                  setOpenDialogSellerUpdate(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => toggleSellerStatus(seller)}
                                className={`${seller.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                              >
                                {seller.status === 'active' ? 'Desactivar' : 'Activar'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Resumen de rendimiento */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                    <UsersIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total vendedores</p>
                    <p className="text-xl font-semibold mt-1">{sellers.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <i className="fas fa-user-check text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vendedores activos</p>
                    <p className="text-xl font-semibold mt-1">{sellers.filter(s => s.status === 'active').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                    <i className="fas fa-trophy text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Puntos acumulados</p>
                    <p className="text-xl font-semibold mt-1">{sellers.reduce((total, seller) => total + seller.points, 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal para agregar/editar vendedor */}
        {(openDialogSellerAdd || openDialogSellerUpdate) && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {openDialogSellerAdd ? 'Agregar Nuevo Vendedor' : 'Editar Vendedor'}
                  </h3>
                  <button
                    onClick={() => {
                      setOpenDialogSellerAdd(false);
                      setOpenDialogSellerUpdate(false);
                      setSellerForm({
                        first_name: "",
                        last_name_paternal: "",
                        last_name_maternal: "",
                        email: "",
                        phone: "",
                        dni: "",
                        start_date: new Date().toISOString().split('T')[0],
                        points: 0,
                        status: 'active'
                      });
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={sellerForm.first_name}
                        onChange={handleSellerChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Nombres del vendedor"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="last_name_paternal" className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
                      <input
                        type="text"
                        id="last_name_paternal"
                        name="last_name_paternal"
                        value={sellerForm.last_name_paternal}
                        onChange={handleSellerChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Apellido paterno"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="last_name_maternal" className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
                      <input
                        type="text"
                        id="last_name_maternal"
                        name="last_name_maternal"
                        value={sellerForm.last_name_maternal}
                        onChange={handleSellerChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Apellido materno"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={sellerForm.email}
                        onChange={handleSellerChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="correo@ejemplo.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={sellerForm.phone}
                        onChange={handleSellerChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="987654321"
                      />
                    </div>
                    <div>
                      <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                      <input
                        type="text"
                        id="dni"
                        name="dni"
                        value={sellerForm.dni}
                        onChange={handleSellerChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="12345678"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">Fecha de ingreso</label>
                      <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={sellerForm.start_date}
                        onChange={handleSellerChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">Puntos</label>
                      <input
                        type="number"
                        id="points"
                        name="points"
                        value={sellerForm.points}
                        onChange={handleSellerChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <select
                        id="status"
                        name="status"
                        value={sellerForm.status}
                        onChange={handleSellerChange}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDialogSellerAdd(false);
                        setOpenDialogSellerUpdate(false);
                        setSellerForm({
                          first_name: "",
                          last_name_paternal: "",
                          last_name_maternal: "",
                          email: "",
                          phone: "",
                          dni: "",
                          start_date: new Date().toISOString().split('T')[0],
                          points: 0,
                          status: 'active'
                        });
                      }}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSeller}
                      disabled={savingSeller}
                      className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {savingSeller ? "Guardando..." : "Guardar vendedor"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal para confirmar eliminación de vendedor */}
        {openDialogSellerDelete && sellerToDelete && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Eliminar Vendedor</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    ¿Estás seguro de que deseas eliminar al vendedor {sellerToDelete.first_name} {sellerToDelete.last_name_paternal}? Esta acción no se puede deshacer.
                  </p>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => {
                      setOpenDialogSellerDelete(false);
                      setSellerToDelete(null);
                    }}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteSeller}
                    className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "companies" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800">
                🏢 Empresas
              </h2>
              
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar empresas por nombre..."
                  className="flex-1 bg-transparent border-0 focus:outline-none text-gray-700 placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                )}
              </div>
            </div>

            {loadingCompanies ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredCompanies.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                    <p className="text-gray-500">
                      {companies.length === 0
                        ? "No hay empresas registradas"
                        : "No se encontraron empresas con ese nombre"}
                    </p>
                  </div>
                ) : (
                  filteredCompanies.map((company, index) => (
                    <div
                      key={company.id}
                      className={`bg-indigo-50 border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-all duration-300`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-20 h-20 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {company.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-800">{company.name}</h4>
                          <p className="text-sm text-gray-600">{company.sector}</p>
                          <p className="text-xs text-gray-500 mt-1">{company.ruc || "-"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => { setCompanyToUpdate(company); setOpenDialogCompanyUpdate(true); }}
                          className="p-2.5 hover:bg-white rounded-lg transition-all border border-gray-200"
                        >
                          <Edit2 size={18} className="text-indigo-600" />
                        </button>
                        <button
                          onClick={() => { setCompanyToDelete(company); setOpenDialogCompanyDelete(true); }}
                          className="p-2.5 hover:bg-white rounded-lg transition-all border border-gray-200"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {view === "products" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              All Products ({products.length})
            </h3>

            {loadingProducts ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {products.map((product, index) => {
                  const colors = [
                    "bg-blue-100",
                    "bg-indigo-100",
                    "bg-cyan-100",
                    "bg-gray-100",
                  ];
                  const colorIndex = index % colors.length;

                  return (
                    <div
                      key={product.id}
                      className={`${colors[colorIndex]} border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-all duration-300 group`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-20 h-20 rounded-lg ${
                            colorIndex === 0
                              ? "bg-blue-500"
                              : colorIndex === 1
                              ? "bg-indigo-500"
                              : colorIndex === 2
                              ? "bg-cyan-500"
                              : "bg-gray-500"
                          } flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden`}
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
                          <h4 className="font-semibold text-lg text-gray-800">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            📧 {product.user.email}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            🏢{" "}
                            {product.user.business_name ||
                              product.user.full_name}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <span className="text-xs font-medium bg-white text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                              💰 ${product.price}
                            </span>
                            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 shadow-sm">
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
                          className="p-2.5 hover:bg-white rounded-lg transition-all duration-200 group-hover:scale-105 border border-gray-200 hover:shadow-sm"
                        >
                          <Edit2 size={18} className="text-indigo-600" />
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(product);
                            setOpenDialogProductDelete(true);
                          }}
                          className="p-2.5 hover:bg-white rounded-lg transition-all duration-200 group-hover:scale-105 border border-gray-200 hover:shadow-sm"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {openDialogUpdate && userToUpdate && (
          <DialogUserUpdate
            open={openDialogUpdate}
            setOpen={setOpenDialogUpdate}
            user={userToUpdate}
            setUserToUpdate={setUserToUpdate}
          />
        )}

        {openDialogDelete && userToDelete && (
          <DialogUserDelete
            open={openDialogDelete}
            setOpen={setOpenDialogDelete}
            user={userToDelete}
            setUserToDelete={setUserToDelete}
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

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}