// src/services/api.js
const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
    // Productos
    getProductos: async () => {
        const response = await fetch(`${API_BASE_URL}/productos`);
        if (!response.ok) throw new Error('Error al cargar productos');
        return response.json();
    },

    getProductoById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/productos/${id}`);
        if (!response.ok) throw new Error('Error al cargar el producto');
        return response.json();
    },

    buscarProductos: async (query) => {
        const response = await fetch(`${API_BASE_URL}/productos/buscar?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Error en la búsqueda');
        return response.json();
    },

    // Categorías
    getCategorias: async () => {
        const response = await fetch(`${API_BASE_URL}/categorias`);
        if (!response.ok) throw new Error('Error al cargar categorías');
        return response.json();
    }
};