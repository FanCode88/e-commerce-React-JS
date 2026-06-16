import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../Context/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './Header.css';

const Header = () => {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartRef = useRef();
  const iconRef = useRef();

  const { cartItems, removeGroupFromCart } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isAdmin = token && user?.isAdmin;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleNavigation = (e, path) => {
    e.stopPropagation();
    setShowCart(false);
    navigate(path);
  };

  useEffect(() => {
    if (!isAdmin) return;

    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/orders/unread-count');
        setUnreadCount(res.data.count);
      } catch (err) {
        console.error('Eroare la preluarea notificărilor de comenzi:', err);
      }
    };

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 10000);

    return () => clearInterval(interval);
  }, [isAdmin, location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target) && iconRef.current && !iconRef.current.contains(e.target)) {
        setShowCart(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key !== 'Escape' || !showCart) return;
      setShowCart(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showCart]);

  return (
    <header className='header'>
      <Link to='/' className='logo'>
        MyStore
      </Link>

      <nav className='nav'>
        {token ? (
          <>
            <span className='user-text'>Hi, {user?.name || 'Utilizator'}!</span>

            <Link to='/products' className='nav-link'>
              Products
            </Link>

            {isAdmin && (
              <>
                <Link to='/admin/dashboard' className='nav-admin-link-wrapper'>
                  Panou Comenzi
                  {unreadCount > 0 && <span className='admin-notification-badge'>{unreadCount}</span>}
                </Link>
                <Link to='/add-product' className='a-products'>
                  Add Products
                </Link>
              </>
            )}

            <button type='button' onClick={handleLogout} className='logout-button'>
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

        {token && (
          <div className='cart-icon-wrapper' onClick={() => setShowCart(!showCart)} ref={iconRef}>
            <ShoppingBag size={24} />
            {cartItems.length > 0 && <span className='cart-badge'>{cartItems.length}</span>}
          </div>
        )}
      </nav>

      {token && (
        <div className={`cart-popup ${showCart ? 'open' : ''}`} ref={cartRef}>
          <div className='head'>
            <div className='close-right'>
              <button
                type='button'
                className='cart-close'
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCart(false);
                }}
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
                <div className='cart-item' key={`${item.productId}-${item.size}`}>
                  <img
                    src={item.image?.[0] || '/fallback-image.png'}
                    alt={item.name}
                    onClick={(e) => handleNavigation(e, `/products/${item.productId}`)}
                  />

                  <div>
                    <strong className='header-cart-title' onClick={(e) => handleNavigation(e, `/products/${item.productId}`)}>
                      {item.name}
                    </strong>
                    <p>Size: {item.size}</p>
                    <p>{item.price} RON</p>
                  </div>

                  <button
                    type='button'
                    className='delete-item'
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGroupFromCart(item.productId, item.size);
                      toast.success(`Produsul ${item.name} a fost șters din coș!`, { containerId: 'main-toast' });
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}

              <button type='button' className='view-bag-btn' onClick={(e) => handleNavigation(e, '/cart')}>
                View Bag
              </button>

              <button type='button' className='header-checkout-btn' onClick={(e) => handleNavigation(e, '/checkout')}>
                Checkout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
