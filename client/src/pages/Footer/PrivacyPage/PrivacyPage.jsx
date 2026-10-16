import React from 'react';
import './PrivacyPage.css';

const PrivacyPage = () => {
  return (
    <div className='legal-container'>
      <h1>Politică de Confidențialitate</h1>
      <div className='legal-content'>
        <h3>1. Date colectate</h3>
        <p>Colectăm doar datele necesare procesării comenzii: Nume, Adresă, Email și Telefon.</p>

        <h3>2. Securitatea datelor</h3>
        <p>Datele dvs. sunt criptate și nu vor fi partajate cu terțe părți, cu excepția firmelor de curierat necesare livrării.</p>

        <h3>3. Drepturile dumneavoastră</h3>
        <p>
          Aveți dreptul de a solicita oricând ștergerea datelor din baza noastră de date trimițându-ne un email la adresa:
          contact@cybervision.ro
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
