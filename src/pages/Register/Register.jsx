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
  const navigate = useNavigate();

  // States para os campos do formulário e erros
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    birthday: '',
    cellphone: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    name: '',
    birthday: '',
    cellphone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Schema de validação com yup
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

  // Função para lidar com a mudança nos campos do formulário
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: '',
    });
  };

  // Função para lidar com a submissão do formulário
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await registerSchema.validate(formData, { abortEarly: false });
      await createAccount({ profile: 'Clients', ...formData });
      setIsLoading(false);
      navigate('/conta-criada');
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.inner.forEach((err) => {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [err.path]: err.message,
          }));
        });
      }
      setIsLoading(false);
    }
  };

  // Verifica se todos os campos do formulário são válidos
  const isFormValid = !Object.values(formErrors).some((error) => !!error);

  // Obtém a data atual
  const currentDate = new Date().toISOString().split('T')[0];

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
        <CardContent>
          <Typography variant="h5" align="center">
            Cadastre-se
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '300px',
              padding: 2,
            }}
          >
            <TextField
              fullWidth
              label="Nome Completo"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              fullWidth
              label="Data de Nascimento"
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              error={!!formErrors.birthday}
              helperText={formErrors.birthday}
              InputProps={{
                inputProps: { max: currentDate },
              }}
            />
            <TextField
              fullWidth
              label="WhatsApp"
              type="tel"
              name="cellphone"
              value={formData.cellphone}
              onChange={handleInputChange}
              error={!!formErrors.cellphone}
              helperText={formErrors.cellphone}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#2231ff', '&:hover': { backgroundColor: '#2231ff' } }}
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              endIcon={isLoading ? <CircularProgress variant="indeterminate" size={20} /> : null}
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
