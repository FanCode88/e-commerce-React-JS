import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useCart } from '../Context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './CardDetails.css';

const CardDetails = () => {
   const { id } = useParams();
   const [product, setProduct] = useState(null);
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const [selectedSize, setSelectedSize] = useState(null);
   const { user } = useSelector((state) => state.auth);
   const { triggerCartRefresh } = useCart();

   useEffect(() => {
      const fetchProduct = async () => {
         const res = await axios.get(
            `http://localhost:8000/api/products/${id}`
         );
         setProduct(res.data);
      };
      fetchProduct();
   }, [id]);

   const handlePrevImage = () => {
      setCurrentImageIndex((prev) =>
         prev === 0 ? product.image.length - 1 : prev - 1
      );
   };

   const handleNextImage = () => {
      setCurrentImageIndex((prev) =>
         prev === product.image.length - 1 ? 0 : prev + 1
      );
   };

   const handleSizeSelect = (size) => {
      setSelectedSize(size);
   };

   const handleAddToCart = async () => {
      if (!selectedSize) {
         toast.warning(
            'Te rugăm să selectezi o mărime înainte de a adăuga în coș!',
            {
               position: 'top-center',
               autoClose: 3000,
            }
         );
         return;
      }

      if (!user?._id) {
         toast.warning('Trebuie să fii autentificat pentru a adăuga în coș!', {
            position: 'top-center',
            autoClose: 3000,
         });
         return;
      }

      try {
         await axios.post('http://localhost:8000/api/cart/add', {
            userId: user._id,
            productId: product._id,
            size: selectedSize,
            quantity: 1,
         });

         triggerCartRefresh();
         toast.success('Produsul a fost adăugat în coș!', {
            position: 'top-center',
            autoClose: 2000,
         });
      } catch (err) {
         console.error('Eroare la adăugarea în coș:', err);
         toast.error('Eroare la adăugarea în coș!', {
            position: 'top-center',
            autoClose: 3000,
         });
      }
   };

   if (!product) return <p>Se încarcă...</p>;

   return (
      <div className='product-detail-container'>
         <div className='image-section'>
            {product.image?.length > 0 ? (
               <div className='carousel-container'>
                  <button
                     className='carousel-button left'
                     onClick={handlePrevImage}
                  >
                     &#8592;
                  </button>

                  <img
                     src={product.image[currentImageIndex]}
                     alt={product.name}
                     className='card-details-image'
                  />

                  <button
                     className='carousel-button right'
                     onClick={handleNextImage}
                  >
                     &#8594;
                  </button>

                  <div className='carousel-indicator'>
                     {currentImageIndex + 1} / {product.image.length}
                  </div>
               </div>
            ) : (
               <p>Imagine indisponibilă</p>
            )}
         </div>

         <div className='info-section'>
            <h2>{product.name}</h2>
            <p>
               <strong>Preț:</strong> {product.price} RON
            </p>
            <p>
               <strong>Brand:</strong> {product.brand}
            </p>
            <p>
               <strong>Descriere:</strong> {product.description}
            </p>

            <div>
               <strong style={{ color: 'orangered' }}>
                  Mărimi disponibile:
               </strong>
               {product.size?.length ? (
                  <div className='size-selector-details'>
                     {product.size.map((size) => (
                        <button
                           key={size}
                           className={`size-button ${
                              selectedSize === size ? 'selected' : ''
                           }`}
                           onClick={() => handleSizeSelect(size)}
                        >
                           {size}
                        </button>
                     ))}
                  </div>
               ) : (
                  <p>Nicio mărime disponibilă</p>
               )}
            </div>

            {user?.isAdmin && (
               <p>
                  <strong>În stoc:</strong> {product.countInStock}
               </p>
            )}
            <button className='addBag' onClick={handleAddToCart}>
               Add to Bag
            </button>
            <ToastContainer />
         </div>
      </div>
   );
};

export default CardDetails;
