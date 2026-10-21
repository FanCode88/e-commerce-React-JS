import React from "react";
import { FaShieldAlt, FaLock, FaCreditCard } from "react-icons/fa";
import "./InfoPages.css";

const SecurityPage = () => {
  return (
    <div className="info-page-cyber">
      <div className="info-container">
        <span className="cyber-tag">// CRIPTARE & PROTOCOLE</span>
        <h1>SISTEM DE PLATĂ SECURIZAT</h1>

        <div className="info-cards-grid">
          <div className="info-card">
            <FaShieldAlt className="info-icon" />
            <h3>Autentificare 3D Secure</h3>
            <p>Toate plățile cu cardul sunt securizate prin sistemele verified by Visa și Mastercard Identity Check.</p>
          </div>

          <div className="info-card">
            <FaLock className="info-icon" />
            <h3>Criptare SSL 256-Bit</h3>
            <p>Datele cardului tău nu sunt stocate pe serverele noastre. Tranzacțiile sunt procesate direct prin gateway-ul bancar autorizat.</p>
          </div>

          <div className="info-card">
            <FaCreditCard className="info-icon" />
            <h3>Plată la Livrare (Ramburs)</h3>
            <p>Opțiune flexibilă de achitare direct curierului în momentul în care primești și verifici coletul.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
