/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Card,
  CardActions,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';
import background from '../../assets/background.jpg';
import logo from '../../assets/logo.png'; // Importe sua imagem de logo
import { useAuth } from '../../context/AuthContext';
import colors from '../../utils/colors';

const StyledTextField = styled(TextField)`
  background-color: white; // Define o fundo como branco
  color: black; // Define a cor do texto como preto
`;

const InfoText = styled.div`
  color: ${colors.third};
  font-size: 14px;
`;

const StyledButton = styled(Button)`
  && {
    width: 100%;
    padding: 12px;
    background-color: ${(props) => props.backgroundColor || '#f6a700'};
    color: ${(props) => props.color || 'black'};
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    height: 55px;
    font-weight: bold;
    -webkit-box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    text-transform: none;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none !important;
  }
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState();
  const navigate = useNavigate();

  const { login, status, isAuthenticated } = useAuth();

  const registerSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(6),
  });

  useEffect(() => {
    console.log('status aqui', status);
    if (status === 201 && isAuthenticated()) {
      navigate('/inicio');
    } else if (status === 401) {
      setAlertOpen(true);
      setMessage('Credenciais inválidas. Por favor, verifique seu email e senha.');
    } else if (status === 203) {
      setAlertOpen(true);
      setMessage('Por favor, verifique seu email para concluir o registro.');
    } else if (status === 403) {
      setAlertOpen(true);
      setMessage('Usuário desabilitado, solicite para que a barbearia ative novamente.');
    }
  }, [status, isAuthenticated]);

  const handleSubmit = () => {
    setIsLoading(true);

    registerSchema
      .validate({ email, password }, { abortEarly: false })
      .then(async () => {
        await login(email, password);
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
      });
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
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
      <Card
        sx={{ maxWidth: 400, backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '300px',
            padding: 2,
          }}
        >
          <Typography variant="h5" align="center" style={{ position: 'relative' }}>
            <img src={logo} alt="Logo" style={{ marginBottom: '-60px' }} width={250} height={250} />
          </Typography>

          <InfoText>E-MAIL</InfoText>
          <StyledTextField
            fullWidth
            placeholder="Digite seu e-mail"
            type="email"
            error={!!emailError}
            helperText={emailError}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={() => setEmailError('')}
          />

          <InfoText>SENHA</InfoText>
          <StyledTextField
            fullWidth
            placeholder="Digite sua senha"
            type="password"
            error={!!passwordError}
            helperText={passwordError}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={() => setPasswordError('')}
          />
        </Box>
        <CardActions>
          <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
              <StyledButton variant="contained" onClick={handleSubmit} disabled={isLoading}>
                ENTRAR
              </StyledButton>
            </Grid>
            <Grid item xs={12}>
              <Button
                style={{
                  marginBottom: '1rem',
                  height: '55px',
                  borderColor: colors.second,
                  borderWidth: '1px', // Adding borderWidth
                  borderStyle: 'solid',
                  backgroundColor: 'transparent',
                  color: colors.second,
                  width: '100%',
                }}
                component={Link}
                to="/registre-se"
              >
                REGISTRE-SE
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        message={message}
      />
    </Box>
  );
}

export default Login;
