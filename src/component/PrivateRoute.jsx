import React from 'react';
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("access");

    if (access) {
      setIsAuthenticated(true);
    }
    setIsChecking(false); // Done checking
  }, []);

  if (isChecking) {
    // Optional: replace with loader/spinner
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
