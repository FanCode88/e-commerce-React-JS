import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const fetchCart = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`http://localhost:8000/api/cart/${user._id}`);
      setCartItems(res.data?.items || []);
    } catch (err) {
      console.error('Eroare la încărcarea coșului:', err);
    }
  };

  const triggerCartRefresh = async () => {
    await fetchCart();
  };

  // ✅ ȘTERGE UN SINGUR ITEM DIN COȘ
  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/${user._id}/${itemId}`);
      await fetchCart();
    } catch (err) {
      console.error('Eroare la ștergerea item-ului:', err);
      throw err;
    }
  };

  const removeGroupFromCart = async (productId, size) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/remove-group`, {
        data: { userId: user._id, productId, size },
      });
      await fetchCart();
    } catch (err) {
      console.error('Eroare la ștergerea grupului:', err);
      throw err;
    }
  };

  const increaseQuantity = async (itemId, productId, size) => {
    try {
      await axios.patch(`http://localhost:8000/api/cart/increase`, {
        userId: user._id,
        productId,
        size,
      });

      await fetchCart();
    } catch (err) {
      console.error('Eroare la creșterea cantității în Context:', err);
      throw err;
    }
  };

  // ✅ SCADE CANTITATEA
  const removeOneFromCart = async (itemId, productId, size) => {
    try {
      // Apelăm endpoint-ul de ștergere/scădere din backend
      await axios.delete(`http://localhost:8000/api/cart/${user._id}/${itemId}`);

      // Sincronizăm imediat starea cu baza de date
      await fetchCart();
    } catch (err) {
      console.error('Eroare la scăderea cantității în Context:', err);
      throw err;
    }
  };

  // ✅ GOLIREA COMPLETĂ A COȘULUI
  const clearCart = async () => {
    try {
      if (!user?._id) return;
      await axios.delete(`http://localhost:8000/api/cart/${user._id}/clear`);
      setCartItems([]);
    } catch (err) {
      console.error('Eroare la golirea coșului:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        triggerCartRefresh,
        removeFromCart,
        fetchCart,
        increaseQuantity,
        removeOneFromCart,
        clearCart,
        removeGroupFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
