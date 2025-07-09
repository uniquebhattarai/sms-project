import React from 'react';
import { Navigate } from 'react-router-dom';

// This route checks if JWT access token exists
function PrivateRoute({ children }) {
  const access = localStorage.getItem("access");

  // If token exists, user is considered logged in
  return access ? children : <Navigate to="/" />;
}

export default PrivateRoute;
