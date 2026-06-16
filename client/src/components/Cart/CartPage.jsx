import React, { useEffect, useState } from 'react';
import { useCart } from '../Context/CartContext';
import { useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems, fetchCart, increaseQuantity, removeOneFromCart, removeGroupFromCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        await fetchCart();
      } catch (err) {
        console.error('Eroare la încărcarea coșului:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user]);

  const handleRemoveGroup = async (productId, size, name) => {
    setActionLoading(true);

    try {
      await removeGroupFromCart(productId, size);

      toast.success(`Produsul ${name} a fost eliminat din coș!`, {
        containerId: 'main-toast',
      });

      await fetchCart();
    } catch (err) {
      toast.error('Eroare la ștergerea produsului', {
        containerId: 'main-toast',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuantityChange = async (actionType, group) => {
    setActionLoading(true);

    try {
      if (actionType === 'increase') {
        await increaseQuantity(group._id, group.productId, group.size);
      } else if (actionType === 'decrease') {
        if (group.quantity > 1) {
          await removeOneFromCart(group._id, group.productId, group.size);
        } else {
          await removeGroupFromCart(group.productId, group.size);

          toast.success(`Produsul ${group.name} a fost eliminat din coș!`, {
            containerId: 'main-toast',
          });
        }
      }

      await fetchCart();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Eroare la actualizarea cantității.';

      toast.error(errorMsg, {
        containerId: 'main-toast',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const groupedItems = cartItems.reduce((acc, item) => {
    const key = `${item.productId}-${item.size}`;
    if (!acc[key]) {
      acc[key] = {
        ...item,
        items: [item],
        quantity: Number(item.quantity) || 1,
      };
    } else {
      acc[key].items.push(item);
      acc[key].quantity = Math.max(acc[key].quantity, Number(item.quantity) || 1);
    }
    return acc;
  }, {});

  const total = Object.values(groupedItems).reduce((sum, group) => sum + group.quantity * parseFloat(group.price || 0), 0);

  const formatPrice = (value) =>
    new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 2,
    }).format(value);

  if (loading) {
    return (
      <div className='cart-loading-container'>
        <p>Se încarcă coșul...</p>
      </div>
    );
  }

  return (
    <div className='cartPage'>
      <h2>Bag</h2>
      {cartItems.length === 0 ? (
        <p className='empty-message'>Your bag is empty.</p>
      ) : (
        <>
          <div className={`cart-items ${actionLoading ? 'processing-fade' : ''}`}>
            {Object.values(groupedItems).map((group) => (
              <div key={`${group.productId}-${group.size}`} className='cart-item-row'>
                <img src={group.image?.[0] || '/fallback.jpg'} alt={group.name} onClick={() => navigate(`/products/${group.productId}`)} />

                <div className='details'>
                  <div className='cart-item-header'>
                    <h3 className='cart-product-link' onClick={() => navigate(`/products/${group.productId}`)}>
                      {group.name}
                    </h3>
                  </div>

                  <p>
                    Size: <strong>{group.size}</strong>
                  </p>

                  <div className='quantity-controls'>
                    <div className='quantity-wrapper'>
                      <button
                        type='button'
                        className='remove-btn'
                        disabled={actionLoading}
                        onClick={() => handleQuantityChange('decrease', group)}
                      >
                        {group.quantity > 1 ? '-' : <Trash2 size={16} />}
                      </button>

                      <span className='quantity-value'>{group.quantity}</span>

                      <button
                        type='button'
                        className='quantity-btn'
                        disabled={actionLoading}
                        onClick={() => handleQuantityChange('increase', group)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p>
                    Price: <strong>{group.price} RON</strong>
                  </p>
                  <p>
                    Total: <strong>{formatPrice(group.quantity * group.price)}</strong>
                  </p>
                </div>

                <button
                  type='button'
                  className='delete-item-btn'
                  disabled={actionLoading}
                  onClick={() => handleRemoveGroup(group.productId, group.size, group.name)}
                  title='Șterge complet produsul'
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className='cart-summary'>
            <h3>Summary</h3>
            <div className='summary-row'>
              <span>Subtotal:</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <div className='summary-row total-highlight'>
              <span>Total:</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button
              type='button'
              className='checkout-btn'
              disabled={actionLoading || cartItems.length === 0}
              onClick={() =>
                navigate('/checkout', {
                  state: {
                    cartItems: Object.values(groupedItems),
                    total,
                  },
                })
              }
            >
              {actionLoading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
