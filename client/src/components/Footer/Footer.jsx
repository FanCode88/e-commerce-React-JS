import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTiktok, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="cyber-footer">
      <div className="footer-top-border"></div>

      <div className="footer-container">
        {/* Brand & Despre */}
        <div className="footer-brand-section">
          <Link to="/" className="footer-logo">
            NIKE<span className="logo-accent">PROJECT</span>
          </Link>
          <p className="footer-about-text">
            Adidași premium și echipamente stradale proiectate pentru viitor. Performanță, stil și autenticitate la fiecare pas.
          </p>

          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Link-uri Rapide Navigare */}
        <div className="footer-links-column">
          <h4>CATEGORII</h4>
          <ul>
            <li>
              <Link to="/products?category=men">Bărbați</Link>
            </li>
            <li>
              <Link to="/products?category=women">Femei</Link>
            </li>
            <li>
              <Link to="/products?category=children">Copii</Link>
            </li>
            <li>
              <Link to="/products">Toate Produsele</Link>
            </li>
          </ul>
        </div>

        {/* Suport & Informații Utile */}
        <div className="footer-links-column">
          <h4>SUPORT CLIENT</h4>
          <ul>
            <li>
              <Link to="/shipping">Livrare & Transport</Link>
            </li>
            <li>
              <Link to="/returns">Retur & Schimburi</Link>
            </li>
            <li>
              <Link to="/security">Plăți Securizate</Link>
            </li>
            <li>
              <Link to="/faq">Întrebări Frecvente</Link>
            </li>
          </ul>
        </div>

        {/* Contact & Suport */}
        <div className="footer-contact-column">
          <h4>CONTACT</h4>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <span>Craiova, România</span>
          </div>
          <div className="contact-item">
            <FaPhoneAlt className="contact-icon" />
            <span>+40 700 000 000</span>
          </div>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <span>support@projectnike.ro</span>
          </div>
        </div>
      </div>

      {/* Bară Copyright / Drepturi Rezervate */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <p>© {new Date().getFullYear()} PROJECT NIKE. Toate drepturile rezervate.</p>
          <div className="footer-legal-links">
            <Link to="/terms">Termeni și Condiții</Link>
            <span className="dot-separator">•</span>
            <Link to="/privacy">Politică de Confidențialitate</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
