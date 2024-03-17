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
import * as yup from 'yup';
import background from '../../assets/background.jpg';
import { createAccount } from '../../service/api';

function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [birthdayError, setBirthdayError] = useState('');
  const [cellphoneError, setCellphoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const registerSchema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    birthday: yup.string().required('Data de nascimento é obrigatória'),
    cellphone: yup
      .string()
      .required('WhatsApp é obrigatório')
      .matches(/^\d{11}$/, 'WhatsApp deve ter 11 dígitos numéricos'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    password: yup
      .string()
      .required('Senha é obrigatória')
      .min(6, 'Senha deve ter no mínimo 6 caracteres'),
  });

  const handleInputChange = (event, setError) => {
    const { value } = event.target;
    setError(value ? '' : null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await registerSchema.validate(
        { email, name, birthday, cellphone, password },
        { abortEarly: false }
      );
      await createAccount({ profile: 'Clients', email, name, birthday, cellphone, password });
      setIsLoading(false);
      navigate('/conta-criada');
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.inner.forEach((err) => {
          switch (err.path) {
            case 'name':
              setNameError(err.message);
              break;
            case 'email':
              setEmailError(err.message);
              break;
            case 'birthday':
              setBirthdayError(err.message);
              break;
            case 'cellphone':
              setCellphoneError(err.message);
              break;
            case 'password':
              setPasswordError(err.message);
              break;
            default:
              break;
          }
        });
      }
      setIsLoading(false);
    }
  };

  const isFormValid =
    !nameError && !emailError && !birthdayError && !cellphoneError && !passwordError;

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
            Cadastre-se
          </Typography>

          <TextField
            fullWidth
            label="Nome Completo"
            type="text"
            error={!!nameError}
            helperText={nameError}
            onChange={(e) => {
              setName(e.target.value);
              handleInputChange(e, setNameError);
            }}
          />
          <TextField
            fullWidth
            label="Data de Nascimento"
            type="date"
            error={!!birthdayError}
            helperText={birthdayError}
            onChange={(e) => {
              setBirthday(e.target.value);
              handleInputChange(e, setBirthdayError);
            }}
          />
          <TextField
            fullWidth
            label="WhatsApp"
            type="number"
            error={!!cellphoneError}
            helperText={cellphoneError}
            onChange={(e) => {
              setCellphone(e.target.value);
              handleInputChange(e, setCellphoneError);
            }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            error={!!emailError}
            helperText={emailError}
            onChange={(e) => {
              setEmail(e.target.value);
              handleInputChange(e, setEmailError);
            }}
          />
          <TextField
            fullWidth
            label="Senha"
            type="password"
            error={!!passwordError}
            helperText={passwordError}
            onChange={(e) => {
              setPassword(e.target.value);
              handleInputChange(e, setPasswordError);
            }}
          />
        </Box>
        <CardActions>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#2231ff', '&:hover': { backgroundColor: '#2231ff' } }}
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              endIcon={
                isLoading ? (
                  <CircularProgress variant="indeterminate" color="inherit" size={20} />
                ) : undefined
              }
            >
              CRIAR CONTA
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
}

export default Register;
