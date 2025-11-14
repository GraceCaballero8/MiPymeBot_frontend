"use client";

import { useState } from "react";
import { Supplier } from "@/app/interfaces/product.interface";
import { Edit2, Trash2, Plus } from "lucide-react";
import { DialogSupplierAdd } from "./DialogSupplierAdd";
import { DialogSupplierEdit } from "./DialogSupplierEdit";
import { DialogSupplierDelete } from "./DialogSupplierDelete";

interface SuppliersTableProps {
  suppliers: Supplier[];
  loading: boolean;
  onRefresh: () => void;
}

export function SuppliersTable({ suppliers, loading, onRefresh }: SuppliersTableProps) {
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Proveedores</h3>
        <button
          onClick={() => setOpenDialogAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Agregar proveedor
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar proveedores..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <i className="fas fa-search"></i>
          </div>
        </div>
      </div>

      {/* Suppliers List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
                  </div>
                </td>
              </tr>
            ) : filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  {searchQuery
                    ? "No se encontraron proveedores con esa búsqueda"
                    : "No hay proveedores registrados"}
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                        <i className="fas fa-building"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{supplier.name}</p>
                        <p className="text-sm text-gray-500">RUC: {supplier.ruc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supplier.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supplier.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supplier.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      supplier.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {supplier.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSupplierToEdit(supplier);
                        setOpenDialogEdit(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSupplierToDelete(supplier);
                        setOpenDialogDelete(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {openDialogAdd && (
        <DialogSupplierAdd
          open={openDialogAdd}
          setOpen={setOpenDialogAdd}
          onRefresh={onRefresh}
        />
      )}

      {openDialogEdit && supplierToEdit && (
        <DialogSupplierEdit
          open={openDialogEdit}
          setOpen={setOpenDialogEdit}
          supplier={supplierToEdit}
          onRefresh={onRefresh}
        />
      )}

      {openDialogDelete && supplierToDelete && (
        <DialogSupplierDelete
          open={openDialogDelete}
          setOpen={setOpenDialogDelete}
          supplier={supplierToDelete}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}