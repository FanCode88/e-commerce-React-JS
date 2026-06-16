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
        const res = await axios.get(`http://localhost:8000/api/cart/${user._id}`);
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error('Eroare la preluarea coșului:', err);
      }
    };
    if (user?._id) fetchCart();
  }, [user]);

  /* 🔥 CORECTARE 1: Calcul sigur pentru subtotal (verifică ambele structuri: populat sau simplu) */
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.price || item.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    const { email, firstName, lastName, address, phone, paymentMethod, cardName, cardNumber, expMonth, expYear, cvv } = formData;

    const cleanEmail = email.trim();
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanAddress = address.trim();
    const cleanPhone = phone.trim();

    const isValidEmail = /\S+@\S+\.\S+/.test(cleanEmail);
    const isValidPhone = /^\d{9,15}$/.test(cleanPhone);

    if (!cleanEmail || !isValidEmail || !cleanFirstName || !cleanLastName || !cleanAddress || !isValidPhone) {
      toast.warning('Completează corect toate câmpurile de livrare!', {
        position: 'bottom-right',
        autoClose: 3000,
      });
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardName || !cardName.trim() || !cardNumber || !cardNumber.trim() || !expMonth || !expYear || !cvv || !cvv.trim()) {
        toast.warning('Completează toate câmpurile cardului!', {
          position: 'bottom-right',
          autoClose: 3000,
        });
        return;
      }

      const formattedCardNumber = cardNumber.replace(/\s+/g, '');
      if (!/^\d{13,19}$/.test(formattedCardNumber)) {
        toast.warning('Număr card invalid! Trebuie să conțină între 13 și 19 cifre.', {
          position: 'bottom-right',
          autoClose: 3000,
        });
        return;
      }

      if (Number(expMonth) < 1 || Number(expMonth) > 12) {
        toast.warning('Luna expirării este invalidă (introdu între 01 și 12)!', {
          position: 'bottom-right',
          autoClose: 3000,
        });
        return;
      }

      const currentYearShort = Number(new Date().getFullYear().toString().slice(-2));
      if (Number(expYear) < currentYearShort || Number(expYear) > 99) {
        toast.warning(`Anul expirării nu poate fi mai mic decât ${currentYearShort}!`, {
          position: 'bottom-right',
          autoClose: 3000,
        });
        return;
      }

      if (!/^\d{3,4}$/.test(cvv.trim())) {
        toast.warning('CVV invalid! Trebuie să fie format din 3 sau 4 cifre.', {
          position: 'bottom-right',
          autoClose: 3000,
        });
        return;
      }
    }

    try {
      /* 🔥 CORECTARE 2: Structură curată și sigură pentru array-ul de produse */
      const processedItems = cartItems.map((item) => {
        // Extrage ID-ul curat, indiferent dacă productId este obiect sau string direct
        const idCurat = item.productId && typeof item.productId === 'object' ? item.productId._id : item.productId;

        return {
          productId: idCurat,
          quantity: item.quantity,
          size: item.size,
        };
      });

      const orderData = {
        userId: user._id,
        items: processedItems,
        email: cleanEmail,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        address: cleanAddress,
        phone: cleanPhone,
        paymentMethod: paymentMethod,
        total: subtotal,
      };

      const res = await axios.post('http://localhost:8000/api/orders', orderData);

      await clearCart();

      if (res.data && res.data.orderNumber) {
        setOrderNumber(res.data.orderNumber);
      }

      setOrderPlaced(true);
    } catch (err) {
      console.error('Eroare la trimiterea comenzii:', err);
      toast.error(err.response?.data?.message || 'A apărut o eroare la server. Încearcă din nou.', {
        position: 'bottom-right',
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
                <input type='email' name='email' placeholder='Email' onChange={handleChange} value={formData.email} />
                <input type='text' name='firstName' placeholder='First Name' onChange={handleChange} value={formData.firstName} />
                <input type='text' name='lastName' placeholder='Last Name' onChange={handleChange} value={formData.lastName} />
                <input type='text' name='address' placeholder='Address' onChange={handleChange} value={formData.address} />
                <input type='text' name='phone' placeholder='Phone Number' onChange={handleChange} value={formData.phone} />
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
                  <input type='text' name='cardName' placeholder='Name on card' onChange={handleChange} value={formData.cardName} />
                  <input type='text' name='cardNumber' placeholder='Card number' onChange={handleChange} value={formData.cardNumber} />
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
                    <input type='text' name='cvv' placeholder='CVV' onChange={handleChange} value={formData.cvv} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='checkout-right'>
            <h2>Order Summary</h2>
            {cartItems.map((item) => {
              // 🔥 Fallback pentru imagini și nume în caz că vin sub obiectul productId
              const name = item.name || item.productId?.name || 'Produs';
              const img = item.image?.[0] || item.productId?.image?.[0] || '/fallback-image.png';
              const price = item.price || item.productId?.price || 0;

              return (
                <div key={item._id} className='cart-summary-item'>
                  <img src={img} alt={name} />
                  <div className='cart-item-details'>
                    <p>
                      <strong>{name}</strong>
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: EU {item.size}</p>
                    <p>RON {price}</p>
                  </div>
                </div>
              );
            })}
            <div className='summary-total'>
              <p>Subtotal: RON {subtotal.toFixed(2)}</p>
              <p>Shipping: Free</p>
              <p>
                <strong>Total: RON {subtotal.toFixed(2)}</strong>
              </p>
            </div>

            <button className='place-order-btn' onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;
