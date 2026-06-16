import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTruck, FaUndoAlt, FaShieldAlt } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';

const HomePage = () => {
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/products?limit=6&sort=desc');
        setNewProducts(res.data);
      } catch (err) {
        console.error('Eroare la încărcarea produselor noi:', err);
      }
    };
    fetchNewProducts();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className='home-page creative-cyber-vision'>

      {/* 1. HERO SCREEN CINEMATIC */}
      <section className='hero-video'>
        <div className='video-container'>
          <video autoPlay muted loop className='background-video'>
            <source src='/assets/adidas.mp4' type='video/mp4' />
          </video>
          <div className='video-darkener'></div>
        </div>
        <div className='video-overlay'>
          <span className='hero-tag'>NEW ERA // PERFORMANCE</span>
          <h1>FĂ PAȘI SPRE<br /><span className='highlight-text'>PERFORMANȚĂ</span></h1>
          <p>Adidași premium proiectați pentru viitorul stilului tău stradal.</p>
          <Link to='/products' className='shop-now'>
            EXPLOREAZĂ COLECȚIA
          </Link>
        </div>
        <div className='hero-bottom-gradient'></div>
      </section>

      {/* 2. PRODUSE NOI (SLIDER BRUTALIST) */}
      <section className='new-arrivals'>
        <div className='section-title-area'>
          <h2>PRODUSE NOI</h2>
          <div className='title-line'></div>
        </div>
        <Slider {...sliderSettings} className='product-slider-creative'>
          {newProducts.map((product) => (
            <div key={product._id} className='slider-item-padding'>
              <Link to={`/products/${product._id}`} className='product-card-creative'>
                <div className='product-img-container'>
                  <img src={Array.isArray(product.image) ? product.image[0] : product.image} alt={product.name} />
                  <div className='price-badge'>{product.price} RON</div>
                </div>
                <div className='product-info-creative'>
                  <p className='product-name-creative'>{product.name}</p>
                  <span className='view-product-link'>VEZI DETALII //</span>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </section>

      {/* 3. COLECȚII INTERACTIVE (MASCĂ DINAMICĂ PE HOVER) */}
      <section className='collections-creative'>
        <Link to='/products?category=men' className='collection-card men'>
          <div className='image-overlay-layer'></div>
          <div className='collection-content'>
            <h3>BĂRBAȚI</h3>
            <span className='collection-link-text'>DISCOVER NOW →</span>
          </div>
        </Link>

        <Link to='/products?category=women' className='collection-card women'>
          <div className='image-overlay-layer'></div>
          <div className='collection-content'>
            <h3>FEMEI</h3>
            <span className='collection-link-text'>DISCOVER NOW →</span>
          </div>
        </Link>

        <Link to='/products?category=children' className='collection-card children'>
          <div className='image-overlay-layer'></div>
          <div className='collection-content'>
            <h3>COPII</h3>
            <span className='collection-link-text'>DISCOVER NOW →</span>
          </div>
        </Link>
      </section>

      {/* 4. ZONE BENEFICII JOS (BARĂ DE UTILITĂȚI INTEGRATĂ PREMIUM) */}
      <section className='benefits-bottom-bar'>
        <div className='benefits-inner-container'>
          <div className='benefit-utility-tab'>
            <div className='utility-icon-box'><FaTruck size={20} /></div>
            <div className='utility-text-box'>
              <h4>LIVRARE TOATĂ ȚARA</h4>
              <p>În 24-48h, gratuit peste 299 RON</p>
            </div>
          </div>

          <div className='benefit-utility-tab'>
            <div className='utility-icon-box'><FaUndoAlt size={18} /></div>
            <div className='utility-text-box'>
              <h4>RETUR ȘI SCHIMBURI</h4>
              <p>30 de zile, procesare rapidă fără bătăi de cap</p>
            </div>
          </div>

          <div className='benefit-utility-tab'>
            <div className='utility-icon-box'><FaShieldAlt size={18} /></div>
            <div className='utility-text-box'>
              <h4>SISTEM DE PLATĂ SECURIZAT</h4>
              <p>Criptare SSL avansată 3D Secure</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
