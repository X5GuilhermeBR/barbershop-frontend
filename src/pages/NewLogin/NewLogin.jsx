/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, CardActions, Snackbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import background from '../../assets/background.jpg';
import TextField from '../../components/TextField';
import { useAuth } from '../../context/AuthContext';
import loginSchema from './schemas';

function Login() {
  // Não haveria mais necessidade de controlar por estado os campos tirei tudo. Pode comparar com o arquivo original
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState();

  // Inicia um hook do react hook form. Há diversos métodos inseridos nele, estou utilizando o que eu preciso aqui. Dá uma olhada na doc dps.
  const { getValues, formState, handleSubmit, ...formProps } = useForm({
    // Defino o yupResolver que vai validar o form
    resolver: yupResolver(loginSchema),
    // Inicio os valores default dos campos
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const navigate = useNavigate();

  const { login, status } = useAuth();
  const { email, password } = getValues();

  useEffect(() => {
    if (status === 201) {
      navigate('/inicio');
    } else if (status === 401) {
      setAlertOpen(true);
      setMessage('Credenciais inválidas. Por favor, verifique seu email e senha.');
    } else if (status === 203) {
      setAlertOpen(true);
      setMessage('Por favor, verifique seu email para concluir o registro.');
    }
  }, [status]);

  const handleLoginSubmit = async () => {
    // O Schema agora está atrelado ao resolver do Form. Ele NÃO envia antes de ter um form válido.
    setIsLoading(true);

    try {
      await login(email, password);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    // Aqui ficaria o provider do seu form
    <FormProvider
      getValues={getValues}
      formState={formState}
      handleSubmit={handleSubmit}
      {...formProps}
    >
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
              // Nome que ficará atrelado ao campo no form
              name="email"
              fullWidth
              label="Email"
              type="email"
              // Aqui ele verifica se tem erro no estado do form e pega a mensagem definida no schema.ts
              error={!!formState.errors?.email?.message}
              helperText={formState.errors?.email?.message}
              // As linhas abaixo passei para o componente
              // onChange={(e) => setEmail(e.target.value)}
              // onKeyDown={() => setEmailError('')}
            />
            <TextField
              // Nome que ficará atrelado ao form
              name="password"
              fullWidth
              label="Senha"
              type="password"
              error={!!formState.errors?.password?.message}
              helperText={formState.errors?.password?.message}
            />
          </Box>
          <CardActions>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                color="primary"
                variant="contained"
                // O submit recebe uma pequena alteração. Precisa passar a função de submit para a função existente na lib.
                onClick={handleSubmit(handleLoginSubmit)}
                disabled={isLoading}
              >
                Entrar
              </Button>
              <Button component={Link} to="/registre-se">
                Registre-se
              </Button>
            </Box>
          </CardActions>
        </Card>
        <Snackbar
          open={alertOpen}
          autoHideDuration={6000}
          onClose={handleAlertClose}
          message={message}
        />
      </Box>
    </FormProvider>
  );
}

export default Login;
