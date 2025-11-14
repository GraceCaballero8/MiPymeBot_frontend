import axios from 'axios';

// Crear una instancia de axios con la configuración base
export const api = axios.create({
  baseURL: 'http://localhost:4000', // URL directa sin variable de entorno
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Función para peticiones fetch (si prefieres usar fetch en lugar de axios)
export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = 'http://localhost:4000'; // URL directa sin variable de entorno
  const token = localStorage.getItem('token');

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }

    return response.json();
  } catch (error) {
    console.error('Error en fetchApi:', error);
    throw error;
  }
};