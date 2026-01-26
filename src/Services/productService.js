import axios from "axios";

const API_URL = "http://localhost:5000";

export const getProducts = () => 
  axios.get(`${API_URL}/productos`);

export const getProductById = (id) => 
  axios.get(`${API_URL}/productos/${id}`);

export const createProduct = (data) => 
  axios.post(`${API_URL}/productos`, data);

export const updateProduct = (id, data) => 
  axios.put(`${API_URL}/productos/${id}`, data);

export const deleteProduct = (id) => 
  axios.delete(`${API_URL}/productos/${id}`);

productService.js