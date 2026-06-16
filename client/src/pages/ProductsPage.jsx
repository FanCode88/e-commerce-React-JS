import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ProductsPage.css';
import { toast } from 'react-toastify';
import { useCart } from '../components/Context/CartContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToBag, setAddedToBag] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  const { triggerCartRefresh } = useCart();
  const { user, token } = useSelector((state) => state.auth);
  const isAdmin = token && user?.isAdmin;

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');

  useEffect(() => {
    fetchProducts();
    setCurrentPage(1);
  }, [category]);

  const fetchProducts = async () => {
    try {
      let url = 'http://localhost:8000/api/products';
      if (category) url += `?category=${category}`;

      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      setError('Eroare la încărcarea produselor.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToBag = async (e, product) => {
    e.stopPropagation();

    if (product.countInStock <= 0) {
      toast.error('Acest... stoc epuizat!');
      return;
    }

    const selectedSize = selectedSizes[product._id];

    if (!selectedSize) {
      toast.warning('Selectează o mărime înainte de adăugare!', {
        containerId: 'main-toast',
        position: 'bottom-right',
        autoClose: 3000,
      });
      return;
    }

    if (!user?._id) {
      toast.warning('Trebuie să fii autentificat!', {
        containerId: 'main-toast',
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

      toast.success(`Produsul ${product.name} a fost adăugat în coș!`, {
        containerId: 'main-toast',
        position: 'bottom-right',
        autoClose: 3000,
      });

      setAddedToBag((prev) => ({ ...prev, [product._id]: true }));
      setTimeout(() => {
        setAddedToBag((prev) => ({ ...prev, [product._id]: false }));
      }, 800);
    } catch (err) {
      toast.error(`Stoc insuficient pentru ${product.name}!`, {
        containerId: 'main-toast',
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const handleSizeChange = (productId, value) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleDelete = async (id, productName) => {
    const confirmDelete = window.confirm('Ești sigur că vrei să ștergi produsul?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((prev) => prev.filter((p) => p._id !== id));

      toast.success(`Produsul ${productName} a fost șters cu succes!`, {
        containerId: 'main-toast',
        position: 'bottom-right',
        autoClose: 3000,
      });
    } catch (err) {
      toast.error('Eroare la ștergerea produsului.', {
        containerId: 'main-toast',
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  if (loading) return <div className='centered-container'>Se încarcă...</div>;
  if (error) return <div className='centered-container'>{error}</div>;

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <>
      <div className='container'>
        <div className='grid'>
          {currentProducts.map((product) => {
            const isOutOfStock = product.countInStock <= 0;

            return (
              <div
                key={product._id}
                className={`card ${isOutOfStock ? 'out-of-stock-card' : ''}`}
                onClick={(e) => {
                  if (e.target.closest('.admin-buttons') || e.target.closest('.add-to-bag-button') || e.target.closest('.size-selector'))
                    return;

                  navigate(`/products/${product._id}`);
                }}
              >
                {isOutOfStock && <div className='out-of-stock-badge'>Out of Stock</div>}

                <img className='product-image' src={Array.isArray(product.image) ? product.image[0] : product.image} alt={product.name} />

                <div className='card-content'>
                  {/* 🔥 CORECTAT: Adăugat clasele tale originale din CSS pentru texte */}
                  <h3 className='product-name'>{product.name}</h3>
                  <div className='product-brand'>Brand: {product.brand}</div>
                  <div className='product-description'>{product.description}</div>

                  <select
                    className='size-selector'
                    value={selectedSizes[product._id] || ''}
                    onChange={(e) => handleSizeChange(product._id, e.target.value)}
                    disabled={isOutOfStock}
                  >
                    <option value=''>{isOutOfStock ? 'No sizes available' : 'Select size'}</option>
                    {!isOutOfStock &&
                      product.size?.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                  </select>

                  <div className='product-price'>{product.price} RON</div>

                  {isAdmin && (
                    <div className='admin-buttons'>
                      <button
                        className='edit-button'
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/products/edit/${product._id}`);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className='delete-button'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product._id, product.name);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <button
                  className={`add-to-bag-button ${addedToBag[product._id] ? 'added' : ''}`}
                  onClick={(e) => handleAddToBag(e, product)}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? 'Stoc epuizat' : addedToBag[product._id] ? 'Added!' : 'Add to Bag'}
                </button>
              </div>
            );
          })}
        </div>

        <div className='pagination'>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
