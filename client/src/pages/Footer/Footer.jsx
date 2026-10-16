import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTruck, FaUndoAlt, FaShieldAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <footer className='cyber-footer-container'>
      {/* 1. Bara de Beneficii */}
      <section className='cyber-footer-benefits'>
        <div className='benefits-inner-container'>
          <div className='benefit-utility-tab' onClick={() => navigate('/shipping')}>
            <div className='utility-icon-box'>
              <FaTruck size={20} />
            </div>

            <div className='utility-text-box'>
              <h4>LIVRARE TOATĂ ȚARA</h4>
              <p>În 24-48h, gratuit peste 299 RON</p>
            </div>
          </div>

          <div className='benefit-utility-tab' onClick={() => navigate('/returns')}>
            <div className='utility-icon-box'>
              <FaUndoAlt size={18} />
            </div>

            <div className='utility-text-box'>
              <h4>RETUR ȘI SCHIMBURI</h4>
              <p>30 de zile, procesare rapidă</p>
            </div>
          </div>

          <div className='benefit-utility-tab' onClick={() => navigate('/payment')}>
            <div className='utility-icon-box'>
              <FaShieldAlt size={18} />
            </div>

            <div className='utility-text-box'>
              <h4>PLATĂ SECURIZATĂ</h4>
              <p>Criptare SSL avansată 3D Secure</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Zona de Copyright și Link-uri Dinamice */}
      <div className='cyber-footer-bottom-bar'>
        <div className='cyber-footer-bottom-content'>
          <p>© {new Date().getFullYear()} ProjectNike. Toate drepturile rezervate.</p>

          <div className='cyber-footer-links'>
            {location.pathname !== '/terms' && <Link to='/terms'>Termeni și Condiții</Link>}

            {location.pathname !== '/privacy' && <Link to='/privacy'>Politica de Confidențialitate</Link>}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
