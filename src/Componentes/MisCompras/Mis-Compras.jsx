import React from "react";
import "./Mis-Compras.css";

const CompraCard = ({ fecha, imagen, estado, descripcion }) => {
  return (
    <div className="compra-card">
      <div className="compra-header">
        <span>{fecha}</span>
        <button className="volver-btn">volver a comprar</button>
      </div>

      <div className="compra-body">
        <img src={imagen} alt="producto comprado" className="compra-img" />

        <div className="compra-info">
          <h4 className="estado">{estado}</h4>
          <p>{descripcion}</p>
        </div>
      </div>
    </div>
  );
};

export default CompraCard;
