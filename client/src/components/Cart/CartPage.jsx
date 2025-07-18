import React, { useEffect, useState } from 'react';
import { useCart } from '../Context/CartContext';
import './CartPage.css';
import { useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartPage = () => {
   const { user } = useSelector((state) => state.auth);
   const {
      cartItems,
      removeFromCart,
      fetchCart,
      increaseQuantity,
      removeOneFromCart,
   } = useCart();
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
      const init = async () => {
         await fetchCart();
         setLoading(false);
      };
      init();
   }, [fetchCart]);

   const handleRemove = async (itemId, all = false) => {
      setLoading(true);
      try {
         if (all) {
            // Pentru ștergerea tuturor item-ilor din grup
            const item = cartItems.find((i) => i._id === itemId);
            if (item) {
               await axios.delete(
                  `http://localhost:8000/api/cart/remove-group`,
                  {
                     data: {
                        userId: user._id,
                        productId: item.productId,
                        size: item.size,
                     },
                  }
               );
            }
         } else {
            await removeFromCart(itemId);
         }
         toast.success('Produs eliminat din coș');
         await fetchCart();
      } catch (err) {
         toast.error('Eroare la ștergere');
      } finally {
         setLoading(false);
      }
   };

   // Grupare corectă a item-urilor
   const groupedItems = cartItems.reduce((acc, item) => {
      const key = `${item.productId}-${item.size}`;
      if (!acc[key]) {
         acc[key] = {
            ...item,
            items: [item],
            quantity: item.quantity || 1,
         };
      } else {
         acc[key].items.push(item);
         acc[key].quantity += item.quantity || 1;
      }
      return acc;
   }, {});

   const total = Object.values(groupedItems).reduce(
      (sum, group) => sum + group.quantity * parseFloat(group.price),
      0
   );

   const formatPrice = (value) =>
      new Intl.NumberFormat('ro-RO', {
         style: 'currency',
         currency: 'RON',
         minimumFractionDigits: 2,
      }).format(value);

   if (loading) return <p>Se încarcă coșul...</p>;

   return (
      <div className='cartPage'>
         <h2>Bag</h2>
         {cartItems.length === 0 ? (
            <p>Your bag is empty.</p>
         ) : (
            <>
               <div className='cart-items'>
                  {Object.values(groupedItems).map((group) => (
                     <div
                        key={`${group.productId}-${group.size}`}
                        className='cart-item-row'
                     >
                        <img
                           src={group.image?.[0] || '/fallback.jpg'}
                           alt={group.name}
                        />
                        <div className='details'>
                           <h3>{group.name}</h3>
                           <p>
                              Size: <strong>{group.size}</strong>
                           </p>
                           <div className='quantity-controls'>
                              <div className='quantity-wrapper'>
                                 <button
                                    type='button'
                                    className='remove-btn'
                                    onClick={async (e) => {
                                       e.preventDefault();
                                       e.stopPropagation();
                                       if (group.quantity > 1) {
                                          await removeOneFromCart(
                                             group.items[0]._id,
                                             group.productId,
                                             group.size
                                          );
                                       } else {
                                          await handleRemove(
                                             group.items[0]._id,
                                             true
                                          );
                                       }
                                    }}
                                    disabled={loading}
                                 >
                                    {group.quantity > 1 ? (
                                       '-'
                                    ) : (
                                       <Trash2 size={20} />
                                    )}
                                 </button>

                                 <span className='quantity-value'>
                                    {group.quantity}
                                 </span>

                                 <button
                                    type='button'
                                    className='quantity-btn'
                                    onClick={async (e) => {
                                       e.stopPropagation();
                                       await increaseQuantity(
                                          group.items[0]._id,
                                          group.productId,
                                          group.size
                                       );
                                    }}
                                    disabled={loading}
                                 >
                                    +
                                 </button>
                              </div>
                           </div>

                           <p>
                              Price: <strong>{group.price} RON</strong>
                           </p>
                           <p>
                              Total:
                              <strong>
                                 {formatPrice(group.quantity * group.price)}
                              </strong>
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
               <div className='cart-summary'>
                  <h3>Summary</h3>
                  <p>
                     Subtotal:
                     <strong>
                        RON <strong>{formatPrice(total)}</strong>
                     </strong>
                  </p>
                  <p>
                     Total:
                     <strong>
                        RON <strong>{formatPrice(total)}</strong>
                     </strong>
                  </p>
                  <button
                     type='button'
                     className='checkout-btn'
                     disabled={loading}
                     onClick={() =>
                        navigate('/checkout', {
                           state: {
                              cartItems: Object.values(groupedItems),
                              total,
                           },
                        })
                     }
                  >
                     {loading ? 'Processing...' : 'Checkout'}
                  </button>
               </div>
            </>
         )}
      </div>
   );
};

export default CartPage;
