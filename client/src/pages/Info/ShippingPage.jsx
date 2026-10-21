import React from "react";
import { FaTruck, FaClock, FaBoxOpen } from "react-icons/fa";
import "./InfoPages.css";

const ShippingPage = () => {
  return (
    <div className="info-page-cyber">
      <div className="info-container">
        <span className="cyber-tag">// PROTOCOL DE LIVRARE</span>
        <h1>POLITICĂ DE EXPEDIERE & LIVRARE</h1>

        <div className="info-cards-grid">
          <div className="info-card">
            <FaTruck className="info-icon" />
            <h3>Curierat Rapid</h3>
            <p>Toate comenzile sunt procesate prin servicii de curierat expres. Livrare în 24-48 de ore lucrătoare oriunde în România.</p>
          </div>

          <div className="info-card">
            <FaBoxOpen className="info-icon" />
            <h3>Livrare Gratuită</h3>
            <p>Beneficiezi de transport 100% gratuit pentru orice comandă care depășește suma de 299 RON.</p>
          </div>

          <div className="info-card">
            <FaClock className="info-icon" />
            <h3>Avertizare & AWB</h3>
            <p>Vei primi un cod AWB prin SMS și E-mail imediat ce coletul părăsește depozitul nostru central.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
