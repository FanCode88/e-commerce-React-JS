import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { ShoppingBag, Trash2, User, ShieldAlert, PlusCircle, LogOut, Package, ArrowRight } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./Header.css";

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
    navigate("/");
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
        const res = await axios.get("http://localhost:8000/api/orders/unread-count");
        setUnreadCount(res.data.count);
      } catch (err) {
        console.error("Eroare la preluarea notificărilor de comenzi:", err);
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
      if (e.key !== "Escape" || !showCart) return;
      setShowCart(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showCart]);

  return (
    <header className="cyber-header">
      <div className="header-glow-line"></div>

      <div className="header-inner">
        {/* LOGO BRAND */}
        <Link to="/" className="cyber-logo">
          <span className="logo-prefix">PROJECT</span>
          <span className="logo-main">NIKE</span>
          <div className="logo-glitch-box"></div>
        </Link>

        {/* NAVIGARE PRINCIPALĂ */}
        <nav className="cyber-nav">
          <Link to="/products" className={`cyber-nav-item ${location.pathname === "/products" ? "active" : ""}`}>
            <Package size={16} />
            <span>PRODUSE</span>
          </Link>

          {token ? (
            <>
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className="cyber-nav-item admin-pulse-link">
                    <ShieldAlert size={16} />
                    <span>PANOU COMENZI</span>
                    {unreadCount > 0 && <span className="cyber-badge-alert">{unreadCount}</span>}
                  </Link>
                  <Link to="/add-product" className="cyber-nav-item">
                    <PlusCircle size={16} />
                    <span> ADAUGĂ</span>
                  </Link>
                </>
              )}
            </>
          ) : null}
        </nav>

        {/* SECȚIUNEA DIN DREAPTA (User, Auth, Coș) */}
        <div className="cyber-actions">
          {token ? (
            <div className="user-logged-box">
              <Link to="/profile" className="user-welcome-link" title="Vezi Profilul Meu">
                <User size={14} />
                <span>{user?.name || "Operator"}</span>
              </Link>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                className="cyber-logout-btn"
                title="Deconectare"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/login" className="cyber-btn-secondary">
                AUTENTIFICARE
              </Link>
              <Link to="/register" className="cyber-btn-primary">
                ÎNREGISTRARE
              </Link>
            </div>
          )}

          {/* ICONIȚĂ COȘ DE CUMPĂRĂTURI */}
          {token && (
            <div className="cyber-cart-wrapper" onClick={() => setShowCart(!showCart)} ref={iconRef}>
              <div className="cart-icon-container">
                <ShoppingBag size={20} />
                {cartItems.length > 0 && <span className="cyber-cart-badge">{cartItems.length}</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* POPUP COȘ DE CUMPĂRĂTURI (SLIDE / DROPDOWN FUTURISTIC) */}
      {token && (
        <div className={`cyber-cart-popup ${showCart ? "open" : ""}`} ref={cartRef}>
          <div className="cart-popup-header">
            <div className="cart-popup-title">
              <ShoppingBag size={18} />
              <span>COȘUL MEU</span>
              <span className="cart-items-count">({cartItems.length})</span>
            </div>
            <button
              type="button"
              className="cart-popup-close"
              onClick={(e) => {
                e.stopPropagation();
                setShowCart(false);
              }}
            >
              &times;
            </button>
          </div>

          <div className="cart-popup-body">
            {cartItems.length === 0 ? (
              <div className="cyber-empty-cart">
                <ShoppingBag size={40} />
                <p>Coșul tău este gol</p>
                <span>Adaugă articole din colecție pentru a continua.</span>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div className="cyber-cart-item" key={`${item.productId}-${item.size}`}>
                    <img src={item.image?.[0] || "/fallback-image.png"} alt={item.name} onClick={(e) => handleNavigation(e, `/products/${item.productId}`)} />
                    <div className="cart-item-details">
                      <strong onClick={(e) => handleNavigation(e, `/products/${item.productId}`)}>{item.name}</strong>
                      <div className="cart-item-meta">
                        <span className="item-size-tag">Mărime: {item.size}</span>
                        <span className="item-price-tag">{item.price} RON</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="cyber-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeGroupFromCart(item.productId, item.size);
                        toast.success(`Produsul ${item.name} a fost șters din coș!`, { containerId: "main-toast" });
                      }}
                      title="Șterge produsul"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="cart-popup-footer">
              <button type="button" className="cyber-view-bag-btn" onClick={(e) => handleNavigation(e, "/cart")}>
                <span>VEZI COȘUL</span>
              </button>
              <button type="button" className="cyber-checkout-btn" onClick={(e) => handleNavigation(e, "/checkout")}>
                <span>FINALIZEAZĂ COMANDA</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
