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
            const res = await axios.get(
               'http://localhost:8000/api/products?limit=6&sort=desc'
            );
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
      speed: 600,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      responsive: [
         { breakpoint: 1024, settings: { slidesToShow: 2 } },
         { breakpoint: 600, settings: { slidesToShow: 1 } },
      ],
   };

   return (
      <div className='home-page'>
         {/* HERO CU VIDEO */}
         <section className='hero-video'>
            <video autoPlay muted loop className='background-video'>
               <source src='/assets/adidas.mp4' type='video/mp4' />
               Your browser does not support the video tag.
            </video>
            <div className='video-overlay'>
               <h1>Fă pași spre performanță</h1>
               <p>Adidași premium pentru stilul tău de viață</p>
               <Link to='/products' className='shop-now'>
                  Vezi colecția
               </Link>
            </div>
         </section>

         {/* PRODUSE NOI CU SLIDER */}
         <section className='new-arrivals'>
            <h2>Produse Noi</h2>
            <Slider {...sliderSettings} className='product-slider'>
               {newProducts.map((product) => (
                  <Link
                     key={product._id}
                     to={`/products/${product._id}`}
                     className='product-card'
                  >
                     <img
                        src={
                           Array.isArray(product.image)
                              ? product.image[0]
                              : product.image
                        }
                        alt={product.name}
                     />
                     <p>{product.name}</p>
                     <span>{product.price} RON</span>
                  </Link>
               ))}
            </Slider>
         </section>

         {/* COLECȚII */}
         <section className='collections'>
            <div className='collection men'>
               <Link to='/products?category=men' className='collection-btn'>
                  <button className='btnCollect'>Vezi</button>
               </Link>
            </div>
            <div className='collection women'>
               <Link to='/products?category=women' className='collection-btn'>
                  <button className='btnCollect'>Vezi</button>
               </Link>
            </div>
            <div className='collection children'>
               <Link
                  to='/products?category=children'
                  className='collection-btn'
               >
                  <button className='btnCollect'>Vezi</button>
               </Link>
            </div>
         </section>

         {/* BENEFICII */}
         <section className='benefits'>
            <div className='benefit-box'>
               <FaTruck size={30} />
               <h4>Livrare rapidă</h4>
               <p>În 24-48h, gratuit peste 299 RON</p>
            </div>
            <div className='benefit-box'>
               <FaUndoAlt size={30} />
               <h4>Retur 30 zile</h4>
               <p>Fără întrebări</p>
            </div>
            <div className='benefit-box'>
               <FaShieldAlt size={30} />
               <h4>Plăți securizate</h4>
               <p>SSL & procesatori verificați</p>
            </div>
         </section>
      </div>
   );
};

export default HomePage;
