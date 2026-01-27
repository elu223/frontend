import { useState } from "react";
import { useLocation } from "wouter";
import axios from 'axios';
import "./registro.css";
import Footer from "../Footer/Footer";
import { useAuth } from '../../auth/AuthProvider';

function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    direccion: ""
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registrar = (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      alert("las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      alert("la contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    axios.post('http://localhost:5000/usuarios/register', {
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      password: form.password,
      telefono: form.telefono || "",
      direccion: form.direccion || ""
    })
    .then((response) => {
      const data = response.data;
      const userData = {
        id_usuario: data.usuario.id_usuario,
        nombre: data.usuario.nombre,
        apellido: data.usuario.apellido,
        email: data.usuario.email,
        id_rol: data.usuario.id_rol,
        token: data.token
      };
      
      // guardar usuario
      login(userData);
      
      // redirigir según rol
      if (data.usuario.id_rol === 1) {
        setLocation('/admin');
      } else {
        setLocation('/');
      }
      
      setLoading(false);
    })
    .catch((error) => {
      console.error('error en el registro:', error);
      if (error.response?.status === 409) {
        alert("este email ya está registrado");
      } else {
        alert("error al registrar");
      }
      setLoading(false);
    });
  }

  return (
    <div className="registro-container">
      <div className="registro-box">
        <h2 className="registro-title">Crear tu cuenta</h2>

        <form onSubmit={registrar}>
          <div className="input-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label>correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-icon-wrapper">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                required
                minLength="6"
              />
              <span className="icon-eye" onClick={() => setShowPass(!showPass)}>
                👁
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Confirmar contraseña</label>
            <div className="input-icon-wrapper">
              <input
                type={showConfirmPass ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input-field"
                required
                minLength="6"
              />
              <span className="icon-eye" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                👁
              </span>
            </div>
          </div>

          <div className="button-row">
            <button type="submit" className="confirmar-btn" disabled={loading}>
              {loading ? "registrando..." : "confirmar"}
            </button>

            <a href="/iniciar-sesion" className="btn-login">
              iniciar sesión
            </a>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Registro;