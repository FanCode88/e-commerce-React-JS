// components/AdminRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
   const { token, user } = useSelector((state) => state.auth);

   if (!token || !user?.isAdmin) {
      return <Navigate to='/' replace />;
   }

   return children;
};

export default AdminRoute;
