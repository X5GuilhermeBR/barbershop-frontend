/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi } from '../service/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const [status, setStatus] = useState(null); // Adicionando estado para armazenar o erro
  const [userInfo, setUserInfo] = useState(null);

  const parseJwt = (token) => {
    // Função para decodificar o token JWT
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  };

  const setUserDataFromToken = (token) => {
    const userData = parseJwt(token); // Realize o parse do token para obter os dados do usuário
    setUserInfo(userData);
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);
      setUserDataFromToken(storedToken)
    }
  }, []);

  useEffect(() => {
    // Aqui você pode executar qualquer ação necessária quando o status mudar
    console.log('Status mudou:', status);
  }, [status]);

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
  
      if (response.status !== 201) {
        setStatus(401); // Define o erro no estado
        return; // Retorna para interromper o fluxo do código
      }
  
      sessionStorage.setItem('token', token);
      setToken(token);
      setUserDataFromToken(token);
      setStatus(201); // Define o status de sucesso
    } catch (error) {
      setStatus(401); // Define o erro no estado
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, userInfo, setUserDataFromToken, login, logout, status }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

