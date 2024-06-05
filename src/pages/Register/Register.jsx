/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';
import background from '../../assets/background.jpg';
import { createAccount } from '../../service/api';
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

export const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  color: ${colors.third};
`;

const styles = {
  radio: {
    color: 'white',
    '&.Mui-checked': {
      color: 'white',
    },
  },
  radioLabel: {
    color: 'white',
  },
};

function Register() {
  const navigate = useNavigate();

  // States para os campos do formulário e erros
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    birthday: '',
    cellphone: '',
    password: '',
    sex: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    name: '',
    birthday: '',
    cellphone: '',
    password: '',
    sex: '',
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
    sex: yup.string().required('Sexo é obrigatório'),
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
      <Card
        sx={{ maxWidth: 400, backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
      >
        <CardContent>
          <Title>Cadastre-se</Title>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '300px',
              padding: 2,
            }}
          >
            <InfoText>NOME COMPLETO</InfoText>
            <StyledTextField
              fullWidth
              placeholder="Digite seu Nome..."
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <InfoText>DATA DE NASCIMENTO</InfoText>
            <StyledTextField
              fullWidth
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
            <InfoText>WHATSAPP</InfoText>
            <StyledTextField
              fullWidth
              placeholder="Digite seu número WhatsApp..."
              type="tel"
              name="cellphone"
              value={formData.cellphone}
              onChange={handleInputChange}
              error={!!formErrors.cellphone}
              helperText={formErrors.cellphone}
            />
            <InfoText>E-MAIL</InfoText>
            <StyledTextField
              fullWidth
              placeholder="Digite seu E-mail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <InfoText>SENHA</InfoText>
            <StyledTextField
              fullWidth
              placeholder="Digite sua Senha..."
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <InfoText>SEXO</InfoText>
              </FormLabel>
              <RadioGroup name="sex" value={formData.sex} onChange={handleInputChange}>
                <FormControlLabel
                  value="M"
                  control={<Radio sx={styles.radio} />}
                  label="Masculino"
                  sx={{ '.MuiFormControlLabel-label': styles.radioLabel }}
                />
                <FormControlLabel
                  value="F"
                  control={<Radio sx={styles.radio} />}
                  label="Feminino"
                  sx={{ '.MuiFormControlLabel-label': styles.radioLabel }}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </CardContent>
        <CardActions>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <StyledButton onClick={handleSubmit}>CRIAR CONTA</StyledButton>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
}

export default Register;
