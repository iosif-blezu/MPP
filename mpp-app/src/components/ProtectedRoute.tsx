// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token'); // Check if token exists in local storage

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
