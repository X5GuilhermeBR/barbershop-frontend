/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => false;

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
