import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ProductsPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../components/Context/CartContext';

const ProductsPage = () => {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [addedToBag, setAddedToBag] = useState({});
   const [selectedSizes, setSelectedSizes] = useState({});
   const [currentPage, setCurrentPage] = useState(1);
   const productsPerPage = 6;

   const { triggerCartRefresh } = useCart();
   const { user, token } = useSelector((state) => state.auth);
   const isAdmin = token && user?.isAdmin;

   const navigate = useNavigate();
   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   const category = queryParams.get('category');

   useEffect(() => {
      fetchProducts();
      setCurrentPage(1); // Resetează pagina la 1 când categoria se schimbă
   }, [category]);

   const fetchProducts = async () => {
      try {
         let url = 'http://localhost:8000/api/products';
         if (category) {
            url += `?category=${category}`;
         }
         const res = await axios.get(url);
         setProducts(res.data);
         setLoading(false);
      } catch (err) {
         setError('Eroare la încărcarea produselor.');
         setLoading(false);
      }
   };

   const handleAddToBag = async (e, product) => {
      e.stopPropagation();
      const selectedSize = selectedSizes[product._id];

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
         toast.warning('Trebuie să fii autentificat pentru a adăuga în coș', {
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

         setAddedToBag((prev) => ({ ...prev, [product._id]: true }));
         setTimeout(() => {
            setAddedToBag((prev) => ({ ...prev, [product._id]: false }));
         }, 800);
      } catch (err) {
         toast.error('Eroare la adăugarea în coș');
      }
   };

   const handleSizeChange = (productId, value) => {
      setSelectedSizes((prev) => ({
         ...prev,
         [productId]: value,
      }));
   };

   const handleDelete = async (id) => {
      const confirmDelete = window.confirm(
         'Ești sigur că vrei să ștergi produsul?'
      );
      if (!confirmDelete) return;

      try {
         await axios.delete(`http://localhost:8000/api/products/${id}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         setProducts((prev) => prev.filter((product) => product._id !== id));
         toast.success('Produsul a fost șters cu succes!', {
            position: 'bottom-right',
            autoClose: 3000,
         });
      } catch (err) {
         toast.error('Eroare la ștergerea produsului.', {
            position: 'bottom-right',
            autoClose: 3000,
         });
      }
   };

   if (loading) {
      return (
         <div className='centered-container'>
            <p className='loading-text'>Se încarcă produsele...</p>
         </div>
      );
   }

   if (error) {
      return (
         <div className='centered-container'>
            <p className='error-text'>{error}</p>
         </div>
      );
   }

   if (products.length === 0) {
      return (
         <div className='centered-container'>
            <p className='empty-text'>Nu există produse disponibile.</p>
         </div>
      );
   }

   // Calculează produsele pentru pagina curentă
   const indexOfLastProduct = currentPage * productsPerPage;
   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
   const currentProducts = products.slice(
      indexOfFirstProduct,
      indexOfLastProduct
   );
   const totalPages = Math.ceil(products.length / productsPerPage);

   return (
      <div className='container'>
         <ToastContainer />
         <div className='grid'>
            {currentProducts.map((product) => (
               <div
                  key={product._id}
                  className='card'
                  onClick={(e) => {
                     if (
                        e.target.closest('.add-to-bag-button') ||
                        e.target.closest('.size-selector') ||
                        e.target.closest('.edit-button') ||
                        e.target.closest('.delete-button')
                     ) {
                        return;
                     }
                     navigate(`/products/${product._id}`);
                  }}
               >
                  {product.image && (
                     <img
                        className='product-image'
                        src={
                           Array.isArray(product.image)
                              ? product.image[0]
                              : product.image
                        }
                        alt={product.name}
                     />
                  )}
                  <div className='card-content'>
                     <h3 className='product-name'>{product.name}</h3>
                     <div className='product-brand'>Brand: {product.brand}</div>
                     <div className='product-description'>
                        {product.description}
                     </div>
                     <select
                        className='size-selector'
                        value={selectedSizes[product._id] || ''}
                        onChange={(e) =>
                           handleSizeChange(product._id, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                     >
                        <option value='' disabled>
                           Select size
                        </option>
                        {product.size?.map((s) => (
                           <option key={s} value={s}>
                              {s}
                           </option>
                        ))}
                     </select>
                     <div className='product-price'>{product.price} RON</div>

                     {isAdmin && (
                        <div className='admin-buttons'>
                           <button
                              type='button'
                              onClick={(e) => {
                                 e.stopPropagation();
                                 navigate(`/products/edit/${product._id}`);
                              }}
                              className='edit-button'
                           >
                              Edit product
                           </button>
                           <button
                              type='button'
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleDelete(product._id);
                              }}
                              className='delete-button'
                           >
                              Delete product
                           </button>
                        </div>
                     )}
                  </div>

                  <button
                     type='button'
                     className={`add-to-bag-button ${
                        addedToBag[product._id] ? 'added' : ''
                     }`}
                     onClick={(e) => {
                        e.stopPropagation();
                        handleAddToBag(e, product);
                     }}
                  >
                     {addedToBag[product._id] ? 'Added!' : 'Add to Bag'}
                  </button>
               </div>
            ))}
         </div>

         {/* Paginație */}
         <div className='pagination'>
            {[...Array(totalPages)].map((_, index) => {
               const pageNum = index + 1;
               return (
                  <button
                     key={pageNum}
                     className={pageNum === currentPage ? 'active' : ''}
                     onClick={() => setCurrentPage(pageNum)}
                  >
                     {pageNum}
                  </button>
               );
            })}
         </div>
      </div>
   );
};

export default ProductsPage;
