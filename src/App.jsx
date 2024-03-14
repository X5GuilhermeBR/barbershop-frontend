import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CreatedAccount from './pages/CreatedAccount/CreatedAccount';
import History from './pages/History/History';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import Register from './pages/Register/Register';
import Schedule from './pages/Schedule/Schedule';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import PrivateRoute from './privateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registre-se" element={<Register />} />
        <Route path="/conta-criada" element={<CreatedAccount />} />
        <Route path="/validar-email" element={<VerifyEmail />} />

        {/* Rotas Privadas */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/agendar"
          element={
            <PrivateRoute>
              <Schedule />
            </PrivateRoute>
          }
        />
        <Route
          path="/historico"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
