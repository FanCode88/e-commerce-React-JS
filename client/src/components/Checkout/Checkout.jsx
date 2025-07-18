import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const CheckoutPage = () => {
   const { user } = useSelector((state) => state.auth);
   const [cartItems, setCartItems] = useState([]);
   const navigate = useNavigate();

   const [formData, setFormData] = useState({
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      paymentMethod: 'card',
      cardName: '',
      cardNumber: '',
      expMonth: '',
      expYear: '',
      cvv: '',
   });

   const [orderPlaced, setOrderPlaced] = useState(false);
   const [orderNumber, setOrderNumber] = useState(null);
   const { clearCart } = useCart();

   useEffect(() => {
      const fetchCart = async () => {
         try {
            const res = await axios.get(
               `http://localhost:8000/api/cart/${user._id}`
            );
            setCartItems(res.data.items || []);
         } catch (err) {
            console.error('Eroare la preluarea coșului:', err);
         }
      };
      if (user?._id) fetchCart();
   }, [user]);

   const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
   );

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handlePlaceOrder = async () => {
      const {
         email,
         firstName,
         lastName,
         address,
         phone,
         paymentMethod,
         cardName,
         cardNumber,
         expMonth,
         expYear,
         cvv,
      } = formData;

      const isValidEmail = /\S+@\S+\.\S+/.test(email);
      const isValidPhone = /^\d{9,15}$/.test(phone);

      if (
         !email ||
         !isValidEmail ||
         !firstName ||
         !lastName ||
         !address ||
         !isValidPhone
      ) {
         toast.warning('Completează corect toate câmpurile!', {
            position: 'top-center',
            autoClose: 3000,
         });
         return;
      }

      if (paymentMethod === 'card') {
         if (
            !cardName.trim() ||
            !cardNumber.trim() ||
            !expMonth ||
            !expYear ||
            !cvv.trim()
         ) {
            toast.warning('Completează corect toate câmpurile cardului!', {
               position: 'top-center',
               autoClose: 3000,
            });
            return;
         }
         // Optional: validări suplimentare card
         if (!/^\d{13,19}$/.test(cardNumber.replace(/\s+/g, ''))) {
            toast.warning('Număr card invalid!', {
               position: 'top-center',
               autoClose: 3000,
            });
            return;
         }
         if (Number(expMonth) < 1 || Number(expMonth) > 12) {
            toast.warning('Luna expirării este invalidă!', {
               position: 'top-center',
               autoClose: 3000,
            });
            return;
         }
         if (Number(expYear) < 22 || Number(expYear) > 99) {
            toast.warning('Anul expirării este invalid!', {
               position: 'top-center',
               autoClose: 3000,
            });
            return;
         }
         if (!/^\d{3,4}$/.test(cvv)) {
            toast.warning('CVV invalid!', {
               position: 'top-center',
               autoClose: 3000,
            });
            return;
         }
      }

      try {
         const orderData = {
            userId: user._id,
            items: cartItems.map((item) => ({
               productId: item.productId,
               quantity: item.quantity,
               size: item.size,
            })),
            ...formData,
            total: subtotal,
         };

         const res = await axios.post(
            'http://localhost:8000/api/orders',
            orderData
         );

         await clearCart();

         if (res.data && res.data.orderNumber) {
            setOrderNumber(res.data.orderNumber);
         }

         setOrderPlaced(true);
      } catch (err) {
         console.error('Eroare la trimiterea comenzii:', err);
         toast.error('A apărut o eroare. Încearcă din nou.', {
            position: 'top-center',
            autoClose: 3000,
         });
      }
   };

   const handleClosePopup = () => {
      setOrderPlaced(false);
      navigate('/');
   };

   return (
      <>
         <ToastContainer />
         {orderPlaced ? (
            <div className='order-confirmation-popup'>
               <div className='order-confirmation-content'>
                  <h2>Vă mulțumim pentru comandă!</h2>
                  {orderNumber && <p>Număr comandă: {orderNumber}</p>}
                  <button onClick={handleClosePopup}>Închide</button>
               </div>
            </div>
         ) : (
            <div className='checkout-container'>
               <div className='checkout-left'>
                  <div className='checkout-section'>
                     <h2>Delivery Information</h2>
                     <div className='checkout-form'>
                        <input
                           type='email'
                           name='email'
                           placeholder='Email'
                           onChange={handleChange}
                           value={formData.email}
                        />
                        <input
                           type='text'
                           name='firstName'
                           placeholder='First Name'
                           onChange={handleChange}
                           value={formData.firstName}
                        />
                        <input
                           type='text'
                           name='lastName'
                           placeholder='Last Name'
                           onChange={handleChange}
                           value={formData.lastName}
                        />
                        <input
                           type='text'
                           name='address'
                           placeholder='Address'
                           onChange={handleChange}
                           value={formData.address}
                        />
                        <input
                           type='text'
                           name='phone'
                           placeholder='Phone Number'
                           onChange={handleChange}
                           value={formData.phone}
                        />
                     </div>
                  </div>

                  <div className='checkout-section'>
                     <h2>Payment Method</h2>
                     <div className='payment-option'>
                        <label>
                           <input
                              type='radio'
                              name='paymentMethod'
                              value='card'
                              checked={formData.paymentMethod === 'card'}
                              onChange={handleChange}
                           />
                           Credit or Debit Card
                        </label>
                     </div>
                     <div className='payment-option'>
                        <label>
                           <input
                              type='radio'
                              name='paymentMethod'
                              value='paypal'
                              checked={formData.paymentMethod === 'paypal'}
                              onChange={handleChange}
                           />
                           PayPal
                        </label>
                     </div>
                     <div className='payment-option'>
                        <label>
                           <input
                              type='radio'
                              name='paymentMethod'
                              value='gpay'
                              checked={formData.paymentMethod === 'gpay'}
                              onChange={handleChange}
                           />
                           Google Pay
                        </label>
                     </div>

                     {formData.paymentMethod === 'card' && (
                        <div className='payment-details'>
                           <input
                              type='text'
                              name='cardName'
                              placeholder='Name on card'
                              onChange={handleChange}
                              value={formData.cardName}
                           />
                           <input
                              type='text'
                              name='cardNumber'
                              placeholder='Card number'
                              onChange={handleChange}
                              value={formData.cardNumber}
                           />
                           <div className='row'>
                              <input
                                 type='number'
                                 name='expMonth'
                                 placeholder='MM'
                                 min='1'
                                 max='12'
                                 onChange={handleChange}
                                 value={formData.expMonth}
                              />
                              <input
                                 type='number'
                                 name='expYear'
                                 placeholder='YY'
                                 min='22'
                                 max='99'
                                 onChange={handleChange}
                                 value={formData.expYear}
                              />
                              <input
                                 type='text'
                                 name='cvv'
                                 placeholder='CVV'
                                 onChange={handleChange}
                                 value={formData.cvv}
                              />
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               <div className='checkout-right'>
                  <h2>Order Summary</h2>
                  {cartItems.map((item) => (
                     <div key={item._id} className='cart-summary-item'>
                        <img
                           src={item.image?.[0] || '/fallback-image.png'}
                           alt={item.name}
                        />
                        <div className='cart-item-details'>
                           <p>
                              <strong>{item.name}</strong>
                           </p>
                           <p>Quantity: {item.quantity}</p>
                           <p>Size: EU {item.size}</p>
                           <p>RON {item.price}</p>
                        </div>
                     </div>
                  ))}
                  <div className='summary-total'>
                     <p>Subtotal: RON {subtotal.toFixed(2)}</p>
                     <p>Shipping: Free</p>
                     <p>
                        <strong>Total: RON {subtotal.toFixed(2)}</strong>
                     </p>
                  </div>

                  <button
                     className='place-order-btn'
                     onClick={handlePlaceOrder}
                  >
                     Place Order
                  </button>
               </div>
            </div>
         )}
      </>
   );
};

export default CheckoutPage;
