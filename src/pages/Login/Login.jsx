import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as yup from 'yup';
import background from '../../assets/background.jpg';
import { createAccount } from '../../service/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const profile = 'Clients';
  const navigate = useNavigate();

  const registerSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(6),
  });

  const handleSubmit = () => {
    setIsLoading(true);

    registerSchema
      .validate({ email, password }, { abortEarly: false })
      .then(() => {
        createAccount({ profile, email, password }).then(() => {
          setIsLoading(false);
          navigate('/login');
        });
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
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={() => setEmailError('')}
          />
          <TextField
            fullWidth
            label="Senha"
            type="password"
            error={!!passwordError}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={() => setPasswordError('')}
          />
        </Box>
        <CardActions>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#2231ff', '&:hover': { backgroundColor: '#2231ff' } }} // Cor do botão e cor do hover
              onClick={handleSubmit}
              disabled={isLoading}
              endIcon={
                isLoading ? (
                  <CircularProgress variant="indeterminate" color="inherit" size={20} />
                ) : undefined
              }
            >
              ENTRAR
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
}

export default Login;
