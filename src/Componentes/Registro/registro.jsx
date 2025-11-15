import { useState } from "react";
import { useLocation } from "wouter";
import HeaderMenu from "../Header/Header-Menu";
import "./registro.css";
import Footer from "../Footer/Footer";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [, setLocation] = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const userData = {
      name: nombre,
      email: email,
      fechaRegistro: new Date().toLocaleDateString(),
    };

    localStorage.setItem("user", JSON.stringify(userData));
    window.dispatchEvent(new Event("storage"));
    setLocation("/");
  };

  return (
    <div className="registro-container">

      <div className="registro-box">
        <h2 className="registro-title">Registrarse</h2>

        <div className="avatar-circle">
          <img src="/img/icon-user.png" alt="icono usuario" className="avatar-img" />
        </div>{/* CIRCULO DE AVATAR */}

        <form onSubmit={handleSubmit} className="registro-form">
          <div className="input-group">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label>Correo electronico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-icon-wrapper">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
              <span
                className="icon-eye"
                onClick={() => setShowPass(!showPass)}
              >
                👁
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Confirmar contraseña</label>
            <div className="input-icon-wrapper">
              <input
                type={showConfirmPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                required
              />
              <span
                className="icon-arrow"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                ⌄
              </span>
            </div>
          </div>

          <div className="button-row">
            <button type="submit" className="btn-confirmar">
              Confirmar
            </button>

            <a href="/iniciar-sesion" className="btn-login">
              Iniciar sesión
            </a>
          </div>
        </form>
      </div>
        <Footer />
    </div>
  );
}

export default Registro;
