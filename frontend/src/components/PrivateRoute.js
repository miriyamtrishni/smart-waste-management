import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(auth.user.role)) {
    return <Navigate to="/" />; // Redirect to home if user doesn't have the right role
  }

  return children;
};

export default PrivateRoute;
