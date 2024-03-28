/* eslint-disable react/no-array-index-key */
import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { getScheduleById } from '../../service/api';

const services = ['Corte de Cabelo', 'Barba', 'Corte e Barba', 'Outros'];

function CustomerService() {
  const [selectedService, setSelectedService] = useState('Corte de Cabelo');
  const [clientName, setClientName] = useState('');
  const [barberName, setBarberName] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  const handleStartService = () => {
    // Implement your logic for starting the service here
    console.log(`Iniciar ${selectedService}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scheduleId = params.get('scheduleId');
    if (scheduleId) {
      getScheduleById(scheduleId)
        .then((response) => {
          const scheduleData = response.data;
          console.log('passou aqui', response);
          setClientName(scheduleData.clientName);
          setBarberName(scheduleData.barberName);
          setScheduledTime(scheduleData.time);
          setSelectedService(scheduleData.service);
        })
        .catch((error) => {
          console.error('Error fetching schedule:', error);
          navigate('/agenda');
        });
    } else {
      navigate('/agenda');
    }
  }, [location.search, navigate]);

  return (
    <>
      <Header icon="" title="Minha agenda" />
      <Grid
        container
        justifyContent="center"
        style={{
          marginBottom: '4rem',
          marginTop: '1rem',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h6" style={{ marginBottom: '1rem' }}>
            Detalhes do Serviço
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '1rem' }}>
            Cliente: {clientName}
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '1rem' }}>
            Barbeiro: {barberName}
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '1rem' }}>
            Hora do Corte: {scheduledTime} - Data do Corte:
          </Typography>
          <FormControl fullWidth style={{ marginBottom: '1rem' }}>
            <InputLabel id="service-label">Serviço</InputLabel>
            <Select
              labelId="service-label"
              id="service-select"
              value={selectedService}
              onChange={handleServiceChange}
            >
              {services.map((service, index) => (
                <MenuItem key={index} value={service}>
                  {service}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartService}
            fullWidth
            style={{ marginTop: '1rem' }}
          >
            Iniciar Atendimento
          </Button>
        </Container>
      </Grid>
    </>
  );
}

export default CustomerService;
