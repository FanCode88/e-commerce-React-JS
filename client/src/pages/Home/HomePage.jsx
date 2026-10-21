import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { FaTruck, FaUndoAlt, FaShieldAlt, FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";

// Săgeți personalizate curate
const SampleNextArrow = ({ className, onClick }) => (
  <button type="button" className={className} onClick={onClick} aria-label="Next">
    <FaChevronRight />
  </button>
);

const SamplePrevArrow = ({ className, onClick }) => (
  <button type="button" className={className} onClick={onClick} aria-label="Previous">
    <FaChevronLeft />
  </button>
);

const HomePage = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchNewProducts = async () => {
      try {
        setLoading(true);
        // Folosește instanța 'api' configurată centralizat
        const res = await api.get("/products?limit=6&sort=desc");
        if (isMounted) {
          setNewProducts(res.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Eroare la încărcarea produselor noi:", err);
          setError("Nu am putut încărca produsele noi.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNewProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: newProducts.length > 3,
    speed: 800,
    slidesToShow: Math.min(3, newProducts.length || 1),
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, newProducts.length || 1),
          infinite: newProducts.length > 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          infinite: newProducts.length > 1,
        },
      },
    ],
  };

  return (
    <div className="home-page creative-cyber-vision">
      {/* 1. HERO SCREEN CINEMATIC */}
      <section className="hero-video">
        <div className="video-container">
          <video autoPlay muted loop playsInline className="background-video" aria-hidden="true">
            <source src="/assets/adidas.mp4" type="video/mp4" />
          </video>
          <div className="video-darkener"></div>
        </div>
        <div className="video-overlay">
          <span className="hero-tag">NEW ERA // PERFORMANCE</span>
          <h1>
            FĂ PAȘI SPRE
            <br />
            <span className="highlight-text">PERFORMANȚĂ</span>
          </h1>
          <p>Adidași premium proiectați pentru viitorul stilului tău stradal.</p>
          <Link to="/products" className="shop-now">
            EXPLOREAZĂ COLECȚIA
          </Link>
        </div>
        <div className="hero-bottom-gradient"></div>
      </section>

      {/* 2. PRODUSE NOI (SLIDER / CARD INDIVIDUAL) */}
      <section className="new-arrivals">
        <div className="section-title-area">
          <h2>PRODUSE NOI</h2>
          <div className="title-line"></div>
        </div>

        {loading ? (
          <div className="slider-state-message">Se încarcă produsele...</div>
        ) : error ? (
          <div className="slider-state-message error">{error}</div>
        ) : newProducts.length > 0 ? (
          newProducts.length === 1 ? (
            /* Dacă există un singur produs, afișăm un card fix, frumos centrat fără carusel */
            <div style={{ maxWidth: "350px", margin: "0 auto" }}>
              {(() => {
                const product = newProducts[0];
                const imageSrc = Array.isArray(product.image) ? product.image[0] : product.image;
                const formattedPrice = typeof product.price === "number" ? product.price.toFixed(2) : product.price;

                return (
                  <Link to={`/products/${product._id}`} className="product-card-creative">
                    <div className="product-img-container">
                      <img src={imageSrc} alt={product.name} loading="lazy" />
                      <div className="price-badge">{formattedPrice} RON</div>
                    </div>
                    <div className="product-info-creative">
                      <p className="product-name-creative" title={product.name}>
                        {product.name}
                      </p>
                      <span className="view-product-link">VEZI DETALII</span>
                    </div>
                  </Link>
                );
              })()}
            </div>
          ) : (
            /* Dacă sunt 2 sau mai multe produse, folosim caruselul Slick normal */
            <Slider {...sliderSettings} className="product-slider-creative">
              {newProducts.map((product) => {
                const imageSrc = Array.isArray(product.image) ? product.image[0] : product.image;
                const formattedPrice = typeof product.price === "number" ? product.price.toFixed(2) : product.price;

                return (
                  <div key={product._id} className="slider-item-padding">
                    <Link to={`/products/${product._id}`} className="product-card-creative">
                      <div className="product-img-container">
                        <img src={imageSrc} alt={product.name} loading="lazy" />
                        <div className="price-badge">{formattedPrice} RON</div>
                      </div>
                      <div className="product-info-creative">
                        <p className="product-name-creative" title={product.name}>
                          {product.name}
                        </p>
                        <span className="view-product-link">VEZI DETALII</span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </Slider>
          )
        ) : (
          <div className="slider-state-message">Nu există produse noi disponibile.</div>
        )}
      </section>

      {/* 3. COLECȚII INTERACTIVE */}
      <section className="collections-creative">
        <Link to="/products?category=men" className="collection-card men">
          <div className="image-overlay-layer"></div>
          <div className="collection-content">
            <h3>BĂRBAȚI</h3>
            <span className="collection-link-text">DISCOVER NOW →</span>
          </div>
        </Link>

        <Link to="/products?category=women" className="collection-card women">
          <div className="image-overlay-layer"></div>
          <div className="collection-content">
            <h3>FEMEI</h3>
            <span className="collection-link-text">DISCOVER NOW →</span>
          </div>
        </Link>

        <Link to="/products?category=children" className="collection-card children">
          <div className="image-overlay-layer"></div>
          <div className="collection-content">
            <h3>COPII</h3>
            <span className="collection-link-text">DISCOVER NOW →</span>
          </div>
        </Link>
      </section>

      {/* 4. ZONE BENEFICII JOS (FUTURISTIC & INTERACTIV) */}
      <section className="benefits-bottom-bar">
        <div className="benefits-glow-grid"></div>
        <div className="benefits-inner-container">
          {/* Card 1: Livrare */}
          <Link to="/shipping" className="benefit-utility-tab">
            <div className="tab-corner-accent top-left"></div>
            <div className="tab-corner-accent bottom-right"></div>

            <div className="utility-icon-box">
              <FaTruck size={22} />
              <span className="icon-pulse-ring"></span>
            </div>

            <div className="utility-text-box">
              <div className="benefit-header-tag">
                <h4>LIVRARE TOATĂ ȚARA</h4>
                <FaArrowRight className="card-arrow-icon" />
              </div>
              <p>În 24-48h, gratuit peste 299 RON</p>
            </div>
          </Link>

          {/* Card 2: Retur */}
          <Link to="/returns" className="benefit-utility-tab">
            <div className="tab-corner-accent top-left"></div>
            <div className="tab-corner-accent bottom-right"></div>

            <div className="utility-icon-box">
              <FaUndoAlt size={20} />
              <span className="icon-pulse-ring"></span>
            </div>

            <div className="utility-text-box">
              <div className="benefit-header-tag">
                <h4>RETUR ȘI SCHIMBURI</h4>
                <FaArrowRight className="card-arrow-icon" />
              </div>
              <p>30 de zile, procesare rapidă fără bătăi de cap</p>
            </div>
          </Link>

          {/* Card 3: Securitate */}
          <Link to="/security" className="benefit-utility-tab">
            <div className="tab-corner-accent top-left"></div>
            <div className="tab-corner-accent bottom-right"></div>

            <div className="utility-icon-box">
              <FaShieldAlt size={20} />
              <span className="icon-pulse-ring"></span>
            </div>

            <div className="utility-text-box">
              <div className="benefit-header-tag">
                <h4>SISTEM DE PLATĂ SECURIZAT</h4>
                <FaArrowRight className="card-arrow-icon" />
              </div>
              <p>Criptare SSL avansată 3D Secure</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
