import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CreatedAccount from './pages/CreatedAccount/CreatedAccount';
import History from './pages/History/History';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import Register from './pages/Register/Register';
import Schedule from './pages/Schedule/Schedule';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registre-se" element={<Register />} />
        <Route path="/conta-criada" element={<CreatedAccount />} />
        <Route path="/validar-email" element={<VerifyEmail />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/agendar" element={<Schedule />} />
        <Route path="/historico" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
