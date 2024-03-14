/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi } from '../service/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const [status, setStatus] = useState(null); // Adicionando estado para armazenar o erro

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const parseJwt = (token) => {
    // Função para decodificar o token JWT
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  };

  const getUserIdAndEmail = () => {
    const token = sessionStorage.getItem('token') || null;
    if (!token) return null;

    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.user) return null;

    const { id, email } = decodedToken.user;
    return { id, email };
  };

  const getTokenExpirationTime = (token) => {
    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.exp) return null;
    return decodedToken.exp * 1000;
  };

  const isAuthenticated = () => {
    const tokenExpirationTime = getTokenExpirationTime(token);
    return token && tokenExpirationTime > new Date().getTime();
  };

  const login = async (email, password) => {
    try {
      const response = await loginApi(email, password);
      const { token } = response.data;

      if (!response.ok) {
        setStatus(401); // Define o erro no estado
        return; // Retorna para interromper o fluxo do código
      }

      sessionStorage.setItem('token', token);
      setToken(token);
    } catch (error) {
      setStatus(401); // Define o erro no estado
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, getUserIdAndEmail, login, logout, status }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
