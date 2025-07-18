import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../Context/CartContext';
import './Header.css';

const Header = () => {
   const { token, user } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const cartRef = useRef();
   const iconRef = useRef();
   const { cartItems, removeGroupFromCart } = useCart();
   const [showCart, setShowCart] = useState(false);

   const handleLogout = () => {
      dispatch(logout());
      navigate('/');
   };

   useEffect(() => {
      const handleClickOutside = (e) => {
         if (
            cartRef.current &&
            !cartRef.current.contains(e.target) &&
            iconRef.current &&
            !iconRef.current.contains(e.target)
         ) {
            setShowCart(false);
         }
      };

      const handleEscape = (e) => {
         if (e.key === 'Escape') {
            setShowCart(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
         document.removeEventListener('keydown', handleEscape);
      };
   }, []);

   return (
      <header className='header'>
         <Link to='/' className='logo'>
            MyStore
         </Link>

         <nav className='nav'>
            {token ? (
               <>
                  <span className='user-text'>
                     Hi, {user?.name || 'Utilizator'}!
                  </span>

                  <Link to='/products' className='nav-link'>
                     Products
                  </Link>

                  {user?.isAdmin && (
                     <Link to='/add-product' className='a-products'>
                        Add Products
                     </Link>
                  )}

                  <button
                     type='button'
                     onClick={handleLogout}
                     className='logout-button'
                  >
                     Logout
                  </button>
               </>
            ) : (
               <>
                  <Link to='/products'>
                     <button type='button' className='products'>
                        Products
                     </button>
                  </Link>
                  <Link to='/login' className='nav-link'>
                     Login
                  </Link>
                  <Link to='/register' className='nav-link'>
                     Register
                  </Link>
               </>
            )}

            {/* Cart Icon - doar dacă utilizatorul e logat */}
            {token && (
               <div
                  className='cart-icon-wrapper'
                  onClick={() => setShowCart(!showCart)}
                  ref={iconRef}
               >
                  <ShoppingBag size={24} color='white' />
                  {cartItems.length > 0 && (
                     <span className='cart-badge'>{cartItems.length}</span>
                  )}
               </div>
            )}
         </nav>

         {/* Cart popup - doar dacă utilizatorul e logat */}
         {token && (
            <div
               className={`cart-popup ${showCart ? 'open' : ''}`}
               ref={cartRef}
            >
               <div className='head'>
                  <div className='close-right'>
                     <button
                        type='button'
                        className='cart-close'
                        onClick={() => setShowCart(false)}
                     >
                        &times;
                     </button>
                  </div>
               </div>

               {cartItems.length === 0 ? (
                  <div className='empty-cart'>
                     <h4>Empty bag</h4>
                  </div>
               ) : (
                  <>
                     <h4>Added to Bag</h4>
                     {cartItems.map((item) => (
                        <div className='cart-item' key={item._id}>
                           <img src={item.image[0]} alt={item.name} />
                           <div>
                              <strong>{item.name}</strong>
                              <p>{item.size}</p>
                              <p>{item.price} RON</p>
                           </div>
                           <button
                              className='delete-item'
                              onClick={() =>
                                 removeGroupFromCart(item.productId, item.size)
                              }
                           >
                              <Trash2 size={20} />
                           </button>
                        </div>
                     ))}

                     <Link to='/cart'>
                        <button
                           type='button'
                           className='view-bag-btn'
                           onClick={() => setShowCart(false)}
                        >
                           View Bag
                        </button>
                     </Link>

                     <Link to='/checkout'>
                        <button type='button' className='header-checkout-btn'>
                           Checkout
                        </button>
                     </Link>
                  </>
               )}
            </div>
         )}
      </header>
   );
};

export default Header;
