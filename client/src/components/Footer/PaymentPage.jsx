import React from 'react';
import './footerCSS.css';

const PaymentPage = () => {
  return (
    <div className='info-page'>
      <div className='info-container'>
        <div className='title-line-footer'></div>
        <h1>Plată securizată</h1>

        <section>
          <h2>Metode de plată</h2>

          <ul>
            <li>Card bancar Visa</li>
            <li>Mastercard</li>
            <li>Apple Pay (dacă este disponibil)</li>
            <li>Google Pay (dacă este disponibil)</li>
            <li>Plată ramburs la livrare</li>
          </ul>
        </section>

        <section>
          <h2>Securitatea tranzacțiilor</h2>

          <p>Toate tranzacțiile sunt criptate prin conexiuni SSL și sunt procesate folosind standardul internațional 3D Secure.</p>
        </section>

        <section>
          <h2>Protecția datelor</h2>

          <p>
            Datele cardului nu sunt stocate pe serverele ProjectNike. Procesarea plăților este realizată exclusiv prin procesatori
            autorizați.
          </p>
        </section>

        <section>
          <h2>Confirmarea plății</h2>

          <p>După finalizarea tranzacției veți primi automat un e-mail de confirmare împreună cu detaliile comenzii.</p>
        </section>
      </div>
    </div>
  );
};

export default PaymentPage;
