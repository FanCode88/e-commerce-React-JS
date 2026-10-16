import React from 'react';
import './TermsPage.css';

const TermsPage = () => {
  return (
    <div className='legal-page-wrapper'>
      <div className='legal-container'>
        <h1>Termeni și Condiții</h1>
        <div className='legal-content'>
          <p>Ultima actualizare: 11 Iulie 2026</p>

          <h3>1. Introducere</h3>
          <p>Prin accesarea site-ului nostru, confirmați că sunteți de acord cu termenii și condițiile de mai jos.</p>

          <h3>2. Dreptul de Retur</h3>
          <p>
            Conform OUG 34/2014, aveți dreptul să returnați produsele în termen de 14 zile calendaristice de la primire, fără a invoca vreun
            motiv.
          </p>
          <ul>
            <li>Produsele trebuie să fie în ambalajul original.</li>
            <li>Produsele nu trebuie să prezinte urme de uzură sau deteriorare.</li>
            <li>Costul transportului pentru retur este suportat de către cumpărător.</li>
          </ul>

          <h3>3. Litigii</h3>
          <p>Orice conflict apărut între vânzător și cumpărător va fi rezolvat pe cale amiabilă.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
