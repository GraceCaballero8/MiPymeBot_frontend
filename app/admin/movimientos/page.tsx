'use client';

import { useState, useEffect } from 'react';
import { Movement } from '@/interfaces/movement.interface';
import { fetchApi } from '@/service/fetchapi';

export default function MovimientosPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const data = await fetchApi('/movement');
        setMovements(data);
      } catch (error) {
        console.error('Error fetching movements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Registro de Movimientos</h2>
          <p className="text-gray-600 mt-1">Registra entradas y salidas de inventario</p>
        </div>

        {/* Navegación por Pestañas */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('form')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'form'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Nuevo Movimiento
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Historial
            </button>
          </nav>
        </div>

        {/* Contenido de la Pestaña: Nuevo Movimiento */}
        {activeTab === 'form' && <MovementForm />}

        {/* Contenido de la Pestaña: Historial */}
        {activeTab === 'history' && <MovementHistory movements={movements} />}
      </div>
    </div>
  );
}

// Componente para el formulario de movimiento
function MovementForm() {
  const [formData, setFormData] = useState({
    type: 'ENTRADA',
    quantity: '',
    reason: '',
    product_id: '',
  });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchApi('/product');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await fetchApi('/movement', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
          product_id: parseInt(formData.product_id),
        }),
      });
      
      alert('Movimiento registrado exitosamente');
      setFormData({
        type: 'ENTRADA',
        quantity: '',
        reason: '',
        product_id: '',
      });
    } catch (error) {
      console.error('Error creating movement:', error);
      alert('Error al registrar el movimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Código del Producto *</label>
        <select
          name="product_id"
          value={formData.product_id}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
        >
          <option value="">Selecciona un producto</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.code})
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha *</label>
        <input
          type="date"
          name="date"
          value={new Date().toISOString().split('T')[0]}
          readOnly
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border bg-gray-100"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de Movimiento *</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
        >
          <option value="ENTRADA">Entrada</option>
          <option value="SALIDA">Salida</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Cantidad *</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Ej: 50"
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Observaciones</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={3}
          placeholder="Detalles adicionales..."
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
        />
      </div>
      
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Movimiento'}
        </button>
        <button
          type="button"
          onClick={() => setFormData({
            type: 'ENTRADA',
            quantity: '',
            reason: '',
            product_id: '',
          })}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}

// Componente para el historial de movimientos
function MovementHistory({ movements }: { movements: Movement[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {movements.map((movement) => (
            <tr key={movement.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(movement.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {movement.product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    movement.type === 'ENTRADA'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {movement.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {movement.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {`${movement.user.first_name} ${movement.user.last_name_paternal}`}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {movement.reason || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}