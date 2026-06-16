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
      try {
        const res = await axios.get(`http://localhost:8000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Eroare la încărcarea produsului:', err);
      }
    };
    fetchProduct();
  }, [id]);

  const handlePrevImage = () => {
    if (!product?.image?.length) return;
    setCurrentImageIndex((prev) => (prev === 0 ? product.image.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!product?.image?.length) return;
    setCurrentImageIndex((prev) => (prev === product.image.length - 1 ? 0 : prev + 1));
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (!product || product.countInStock <= 0) {
      toast.error('Stoc indisponibil pentru acest produs!', {
        position: 'bottom-right',
        autoClose: 3000,
      });
      return;
    }

    if (!selectedSize) {
      toast.warning('Te rugăm să selectezi o mărime înainte de a adăuga în coș!', {
        position: 'bottom-right',
        autoClose: 3000,
      });
      return;
    }

    if (!user?._id) {
      toast.warning('Trebuie să fii autentificat pentru a adăuga în coș!', {
        position: 'bottom-right',
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
        position: 'bottom-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Eroare la adăugarea în coș:', err);
      const serverError = err.response?.data?.message || err.response?.data?.error;
      toast.error(serverError || 'Eroare la adăugarea în coș!', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  if (!product) return <p>Se încarcă...</p>;

  const isOutOfStock = product.countInStock <= 0;

  return (
    <div className='product-detail-container'>
      <div className='image-section'>
        {product.image?.length > 0 ? (
          <div className='carousel-container'>
            <button className='carousel-button left' onClick={handlePrevImage}>
              &#8592;
            </button>

            <img src={product.image[currentImageIndex]} alt={product.name} className='card-details-image' />

            <button className='carousel-button right' onClick={handleNextImage}>
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
          <strong style={{ color: 'orangered' }}>Mărimi disponibile:</strong>
          {product.size?.length ? (
            <div className='size-selector-details'>
              {product.size.map((size) => (
                <button
                  key={size}
                  className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => handleSizeSelect(size)}
                  disabled={isOutOfStock}
                >
                  {size}
                </button>
              ))}
            </div>
          ) : (
            <p>Nicio mărime disponibilă</p>
          )}
        </div>

        <p>
          <strong>Status:</strong>{' '}
          {isOutOfStock ? (
            <span style={{ color: 'red', fontWeight: 'bold' }}>Stoc indisponibil</span>
          ) : (
            <span style={{ color: 'green', fontWeight: 'bold' }}>În stoc ({product.countInStock} buc.)</span>
          )}
        </p>

        <button className={`addBag ${isOutOfStock ? 'out-of-stock-btn' : ''}`} onClick={handleAddToCart} disabled={isOutOfStock}>
          {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CardDetails;
