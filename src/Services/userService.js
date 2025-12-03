import axios from "axios";

const API_URL = "http://localhost:5000";

export const loginUser = (data) =>
  axios.post(`${API_URL}/usuarios/login`, data);

export const registerUser = (data) =>
  axios.post(`${API_URL}/usuarios/register`, data);

export const getUserProfile = (id) =>
  axios.get(`${API_URL}/usuarios/${id}`);

export const getUsuarios = () =>
  axios.get(`${API_URL}/usuarios`);