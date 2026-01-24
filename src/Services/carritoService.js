import axios from "axios";

const API_URL = "http://localhost:5000/api/carritos";

export const getCarritos = () => axios.get(API_URL);
export const createCarrito = (id_usuario) => axios.post(API_URL, { id_usuario });