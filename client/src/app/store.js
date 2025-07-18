import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/productSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
   reducer: {
      products: productReducer,
      cart: cartReducer,
      auth: authReducer,
   },
});
