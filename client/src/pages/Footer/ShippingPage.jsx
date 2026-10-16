import React from 'react';
import './footerCSS.css';

const ShippingPage = () => {
  return (
    <div className='info-page'>
      <div className='info-container'>
        <div className='title-line-footer'></div>
        <h1>Livrare</h1>

        <section>
          <h2>Procesarea comenzilor</h2>
          <p>
            Toate comenzile sunt procesate în maximum 24 de ore lucrătoare după confirmarea plății. Comenzile plasate în weekend sau în
            zilele nelucrătoare vor fi procesate în următoarea zi lucrătoare.
          </p>
        </section>

        <section>
          <h2>Timp de livrare</h2>

          <ul>
            <li>24-48 ore pentru majoritatea localităților.</li>
            <li>48-72 ore pentru zonele greu accesibile.</li>
          </ul>
        </section>

        <section>
          <h2>Costul livrării</h2>

          <ul>
            <li>
              Livrare GRATUITĂ pentru comenzile peste <strong>299 RON</strong>.
            </li>
            <li>
              Pentru comenzile sub această valoare, costul livrării este <strong>19 RON</strong>.
            </li>
          </ul>
        </section>

        <section>
          <h2>Verificarea coletului</h2>

          <p>
            Vă recomandăm verificarea integrității coletului la primire. Orice deteriorare vizibilă trebuie semnalată curierului înainte de
            acceptarea coletului.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPage;
