import React from "react";
import { FaUndoAlt, FaExchangeAlt, FaCheckCircle } from "react-icons/fa";
import "./InfoPages.css";

const ReturnsPage = () => {
  return (
    <div className="info-page-cyber">
      <div className="info-container">
        <span className="cyber-tag">// PROTOCOL DE RETUR</span>
        <h1>RETURURI ȘI SCHIMBURI SIMPLIFICATE</h1>

        <div className="info-cards-grid">
          <div className="info-card">
            <FaUndoAlt className="info-icon" />
            <h3>Termen de 30 de Zile</h3>
            <p>Ai la dispoziție 30 de zile calendaristice de la primirea coletului pentru a solicita returul sau schimbul mărimii.</p>
          </div>

          <div className="info-card">
            <FaExchangeAlt className="info-icon" />
            <h3>Schimb Gratuit de Mărime</h3>
            <p>Dacă mărimea nu se potrivește, trimitem curierul să schimbe produsul la ușă fără costuri suplimentare de transport.</p>
          </div>

          <div className="info-card">
            <FaCheckCircle className="info-icon" />
            <h3>Rambursare Rapidă</h3>
            <p>Banii îți sunt restituiți în contul bancar în maxim 3-5 zile lucrătoare de la recepția și verificarea produsului.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
