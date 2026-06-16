import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import CardDetails from './components/CardDetails/CardDetails';
import CartPage from './components/Cart/CartPage';
import Checkout from './components/Checkout/Checkout';
import { CartProvider } from './components/Context/CartContext';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ToastContainer position='bottom-right' autoClose={3000} containerId='main-toast' />

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
            path='/products/:id'
            element={
              <PrivateRoute>
                <CardDetails />
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

          {/* 🔥 CORECTAT: Am securizat dashboard-ul cu AdminRoute, eliminând variabila problematică isAdmin */}
          <Route
            path='/admin/dashboard'
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
