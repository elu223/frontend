import axios from "axios";

const API_URL = "http://localhost:5000";

export const loginUser = (data) =>
  axios.post(`${API_URL}/users/login`, data);

export const registerUser = (data) =>
  axios.post(`${API_URL}/users/register`, data);

export const getUserProfile = (id) =>
  axios.get(`${API_URL}/users/${id}`);

userService.js