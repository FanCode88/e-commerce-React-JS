import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header/HeaderPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import HomePage from './pages/Home/HomePage';
import PrivateRoute from './components/PrivateRoute';
import AddProduct from './components/Add/AddProduct';
import AdminRoute from './components/AdminRoute';
import CardEdit from './components/Card/CardEdit';
import CarDetatails from './components/CardDetails/CardDetails';
import CartPage from './components/Cart/CartPage.jsx';
import Checkout from './components/Checkout/Checkout.jsx';

import { CartProvider } from './components/Context/CartContext.jsx';

function App() {
   return (
      <CartProvider>
         <BrowserRouter>
            <Header />
            <Routes>
               <Route path='/' element={<HomePage />} />
               <Route path='/login' element={<LoginPage />} />
               <Route path='/register' element={<RegisterPage />} />

               <Route
                  path='/products'
                  element={
                     <PrivateRoute>
                        <ProductsPage />
                     </PrivateRoute>
                  }
               />
               <Route
                  path='/add-product'
                  element={
                     <AdminRoute>
                        <AddProduct />
                     </AdminRoute>
                  }
               />
               <Route
                  path='/products/edit/:id'
                  element={
                     <AdminRoute>
                        <CardEdit />
                     </AdminRoute>
                  }
               />
               <Route
                  path='/products/:id'
                  element={
                     <PrivateRoute>
                        <CarDetatails />
                     </PrivateRoute>
                  }
               />
               <Route
                  path='/cart'
                  element={
                     <PrivateRoute>
                        <CartPage />
                     </PrivateRoute>
                  }
               />
               <Route
                  path='/checkout'
                  element={
                     <PrivateRoute>
                        <Checkout />
                     </PrivateRoute>
                  }
               />

               <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
         </BrowserRouter>
      </CartProvider>
   );
}

export default App;
