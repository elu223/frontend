import { useState } from "react";
import { useLocation } from "wouter";
import HeaderMenu from "../Header/Header-Menu";
import "./registro.css";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState(""); // Agregar apellido
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [, setLocation] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      // Enviar datos al backend
      const response = await fetch('http://localhost:5000/api/usuarios/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre,
          apellido: apellido,
          email: email,
          password: password,
          telefono: "", // Puedes agregar campo para teléfono si lo necesitas
          direccion: "", // Puedes agregar campo para dirección si lo necesitas
          id_rol: 2 // Rol de usuario normal (2)
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Guardar usuario en localStorage (igual que en login)
        const userData = {
          token: data.token,
          name: data.nombre,
          apellido: data.apellido,
          email: email,
          rol: data.rol
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Disparar evento para que HeaderMenu se actualice
        window.dispatchEvent(new Event('storage'));
        
        // Redirigir al home
        setLocation("/");
        
      } else {
        const errorData = await response.text();
        alert(`Error en el registro: ${errorData}`);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <HeaderMenu />

      <div className="registro-box">
        <h2 className="registro-title">Registrarse</h2>

        <div className="avatar-circle">
          <img src="/img/icon-user.png" alt="icono usuario" className="avatar-img" />
        </div>

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
            <label>Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label>Correo electrónico</label>
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
                minLength="6"
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
                minLength="6"
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
            <button 
              type="submit" 
              className="btn-confirmar"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Confirmar"}
            </button>

            <a href="/iniciar-sesion" className="btn-login">
              Iniciar sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registro;