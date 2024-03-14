import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import background from '../../assets/background.jpg';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false); // Estado para controlar a exibição do alerta

  const { login, status } = useAuth();
  const navigate = useNavigate();

  const registerSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(6),
  });

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleSubmit = () => {
    setIsLoading(true);

    registerSchema
      .validate({ email, password }, { abortEarly: false })
      .then(async () => {
        await login(email, password);
        console.log('status', status);
        if (status === 401) {
          navigate('/inicio');
        }
        setAlertOpen(true);
        setIsLoading(false);
      })
      .catch((errors) => {
        setIsLoading(false);
        errors.inner.forEach((error) => {
          switch (error.path) {
            case 'email':
              setEmailError(error.message);
              break;
            case 'password':
              setPasswordError(error.message);
              break;
            default:
          }
        });

        // Exibir alerta de credenciais inválidas
        setAlertOpen(true);
      });
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Card sx={{ maxWidth: 400 }}>
        <CardContent />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '300px',
            padding: 2,
          }}
        >
          <Typography variant="h5" align="center">
            Login
          </Typography>

          <TextField
            fullWidth
            label="Email"
            type="email"
            error={!!emailError}
            helperText={emailError}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={() => setEmailError('')}
          />
          <TextField
            fullWidth
            label="Senha"
            type="password"
            error={!!passwordError}
            helperText={passwordError}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={() => setPasswordError('')}
          />
        </Box>
        <CardActions>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {isLoading ? (
              <CircularProgress variant="indeterminate" color="inherit" size={20} />
            ) : (
              <Button
                variant="contained"
                sx={{ backgroundColor: '#2231ff', '&:hover': { backgroundColor: '#2231ff' } }} // Cor do botão e cor do hover
                onClick={handleSubmit}
                disabled={isLoading}
              >
                ENTRAR
              </Button>
            )}
          </Box>
        </CardActions>
      </Card>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        message="Credenciais inválidas. Por favor, verifique seu email e senha."
      />
    </Box>
  );
}

export default Login;
