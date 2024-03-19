import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Clients from './pages/Clients/Clients';
import CreatedAccount from './pages/CreatedAccount/CreatedAccount';
import EditPassword from './pages/EditPassword/EditPassword';
import EditProfile from './pages/EditProfile/EditProfile';
import History from './pages/History/History';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Options from './pages/Options/Options';
import Register from './pages/Register/Register';
import Schedule from './pages/Schedule/Schedule';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import PrivateRoute from './privateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registre-se" element={<Register />} />
          <Route path="/conta-criada" element={<CreatedAccount />} />
          <Route path="/validar-email" element={<VerifyEmail />} />

          {/* Rotas Privadas */}
          <Route
            path="/inicio"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <PrivateRoute>
                <Options />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes/editar-perfil"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes/alterar-senha"
            element={
              <PrivateRoute>
                <EditPassword />
              </PrivateRoute>
            }
          />
          <Route
            path="/novo-agendamento"
            element={
              <PrivateRoute>
                <Schedule />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes/historico"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes/clientes"
            element={
              <PrivateRoute>
                <Clients />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
