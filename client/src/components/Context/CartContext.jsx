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
         const res = await axios.get(
            `http://localhost:8000/api/cart/${user._id}`
         );
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
         await axios.delete(
            `http://localhost:8000/api/cart/${user._id}/${itemId}`
         );
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
      }
   };

   const increaseQuantity = async (itemId, productId, size) => {
      try {
         // Update optimist: crește doar primul item care corespunde grupului
         setCartItems((prevItems) => {
            let found = false;
            return prevItems.map((item) => {
               if (
                  item.productId === productId &&
                  item.size === size &&
                  !found &&
                  item._id === itemId
               ) {
                  found = true;
                  return { ...item, quantity: item.quantity + 1 };
               }
               return item;
            });
         });

         await axios.patch(`http://localhost:8000/api/cart/increase`, {
            userId: user._id,
            itemId,
         });
      } catch (err) {
         console.error('Eroare la creșterea cantității:', err);
         throw err;
      }
   };

   const removeOneFromCart = async (itemId, productId, size) => {
      try {
         // Update optimist pe toate itemele care au același productId + size
         setCartItems((prevItems) => {
            let found = false;
            const newItems = prevItems.map((item) => {
               if (
                  item.productId === productId &&
                  item.size === size &&
                  !found &&
                  item._id === itemId
               ) {
                  found = true; // scădem doar o dată
                  return { ...item, quantity: item.quantity - 1 };
               }
               return item;
            });
            return newItems.filter((item) => item.quantity > 0);
         });

         await axios.delete(
            `http://localhost:8000/api/cart/${user._id}/${itemId}`
         );
      } catch (err) {
         console.error('Eroare la scăderea cantității:', err);
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
