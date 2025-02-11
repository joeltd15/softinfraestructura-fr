import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, checkPermission } from '../authUtils';

const ProtectedRoute = ({ requiredPermission }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !checkPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;