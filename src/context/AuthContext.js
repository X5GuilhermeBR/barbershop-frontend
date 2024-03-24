/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi } from '../service/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const [status, setStatus] = useState(); // Adicionando estado para armazenar o erro
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
      setUserDataFromToken(storedToken);
    }
  }, []);

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
      console.log('stat', status);

      if (response.status === 401) {
        setStatus(401); // Define o erro no estado
        return; // Retorna para interromper o fluxo do código
      }

      if (response.status === 203) {
        setStatus(203); // Define o erro no estado
        return; // Retorna para interromper o fluxo do código
      }

      sessionStorage.setItem('token', token);
      setToken(token);
      setUserDataFromToken(token);
      setStatus(201); // Define o status de sucesso
    } catch (error) {
      setStatus(401); // Define o erro no estado
      if (error.status === 403) {
        setStatus(403); // Define o erro no estado
        // Retorna para interromper o fluxo do código
      }
    }
  };

  const logout = () => {
    setStatus('');
    setToken();
    setUserInfo();
    sessionStorage.removeItem('token'); // Limpa o token
    return true; // Indica que o logout foi realizado com sucesso
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        userInfo,
        setUserInfo,
        setUserDataFromToken,
        login,
        logout,
        status,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
