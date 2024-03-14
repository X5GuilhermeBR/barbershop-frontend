import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CreatedAccount from './pages/CreatedAccount/CreatedAccount';
import Login from './pages/Login/Login';
import Main from './pages/Main/Main';
import Register from './pages/Register/Register';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registre-se" element={<Register />} />
        <Route path="/conta-criada" element={<CreatedAccount />} />
        <Route path="/validar-email" element={<VerifyEmail />} />
        <Route path="/inicio" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;
