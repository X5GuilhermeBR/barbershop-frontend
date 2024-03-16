import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import CreatedAccount from './pages/CreatedAccount/CreatedAccount';
import History from './pages/History/History';
import Home from './pages/Home/Home';
// import Login from './pages/Login/Login';
import NewLogin from './pages/NewLogin/NewLogin';
import Profile from './pages/Profile/Profile';
import Register from './pages/Register/Register';
import Schedule from './pages/Schedule/Schedule';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import PrivateRoute from './privateRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2231ff',
    },
    secondary: {
      main: '#FFF',
    },
    error: {
      main: '#CC1100',
    },
    warning: {
      main: '#EED202',
    },
    success: {
      main: '#5cb85c',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<NewLogin />} />
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
