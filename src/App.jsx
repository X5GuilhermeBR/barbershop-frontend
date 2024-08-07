import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Clients from './pages/Clients/Clients';
import CreatedAccount from './pages/CreatedAccount/CreatedAccount';
import CustomerService from './pages/CustomerService/CustomerService';
import EditPassword from './pages/EditPassword/EditPassword';
import EditProduct from './pages/EditProducts/EditProducts';
import EditProfile from './pages/EditProfile/EditProfile';
import EditService from './pages/EditService/EditService';
import Financial from './pages/Financial/Financial';
import History from './pages/History/History';
import Home from './pages/Home/Home';
import ListProducts from './pages/ListProducts/ListProducts';
import ListServices from './pages/ListServices/ListServices';
import Login from './pages/Login/Login';
import NewSchedule from './pages/NewSchedule/NewSchedule';
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
                <NewSchedule />
              </PrivateRoute>
            }
          />
          <Route
            path="/agenda"
            element={
              <PrivateRoute>
                <Schedule />
              </PrivateRoute>
            }
          />
          <Route
            path="/agenda/atendimento-ao-cliente"
            element={
              <PrivateRoute>
                <CustomerService />
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
          <Route
            path="/configuracoes/produtos"
            element={
              <PrivateRoute>
                <ListProducts />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes/produtos/novo-produto"
            element={
              <PrivateRoute>
                <EditProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes/servicos"
            element={
              <PrivateRoute>
                <ListServices />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes/servicos/novo-servico"
            element={
              <PrivateRoute>
                <EditService />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes/financeiro"
            element={
              <PrivateRoute>
                <Financial />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
