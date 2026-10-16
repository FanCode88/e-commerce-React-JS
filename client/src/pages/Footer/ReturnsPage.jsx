import React from 'react';
import './footerCSS.css';

const ReturnsPage = () => {
  return (
    <div className='info-page'>
      <div className='info-container'>
        <div className='title-line-footer'></div>
        <h1>Retur și Schimburi</h1>

        <section>
          <h2>Dreptul de retur</h2>

          <p>
            Produsele pot fi returnate în termen de <strong>30 de zile</strong>
            de la primirea comenzii.
          </p>
        </section>

        <section>
          <h2>Condiții de retur</h2>

          <ul>
            <li>Produsul să nu prezinte urme de utilizare.</li>
            <li>Ambalajul original trebuie păstrat.</li>
            <li>Toate accesoriile trebuie returnate.</li>
            <li>Etichetele trebuie să fie intacte.</li>
          </ul>
        </section>

        <section>
          <h2>Schimb de mărime</h2>

          <p>Dacă mărimea comandată nu este potrivită, puteți solicita schimbul în limita stocului disponibil.</p>
        </section>

        <section>
          <h2>Rambursarea banilor</h2>

          <p>Rambursarea se efectuează în maximum 14 zile de la recepționarea produsului returnat și verificarea acestuia.</p>
        </section>
      </div>
    </div>
  );
};

export default ReturnsPage;
