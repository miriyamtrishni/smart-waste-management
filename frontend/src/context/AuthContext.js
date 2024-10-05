// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  useEffect(() => {
    const storedData = localStorage.getItem('authData');
    if (storedData) {
      setAuth(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem('authData', JSON.stringify(auth));
      axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
    } else {
      localStorage.removeItem('authData');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
