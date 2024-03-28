import { Button, Container, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { getScheduleById } from '../../service/api';

function CustomerService() {
  const [clientName, setClientName] = useState('');
  const [barberName, setBarberName] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduleService, setScheduleService] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scheduleId = params.get('scheduleId');
    if (scheduleId) {
      getScheduleById(scheduleId)
        .then((response) => {
          const scheduleData = response.data;
          setClientName(scheduleData.clientName);
          setBarberName(scheduleData.barberName);
          setScheduledTime(scheduleData.time);
          setScheduledDate(scheduleData.date);
          setScheduleService(scheduleData.serviceName);
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
      <Header icon="" title="Atendimento ao Cliente" />
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
            Hora do Corte: {scheduledTime} - Data do Corte: {scheduledDate}
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '1rem' }}>
            Serviço: {scheduleService}
          </Typography>
          <Button variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }}>
            Iniciar Atendimento
          </Button>
        </Container>
      </Grid>
    </>
  );
}

export default CustomerService;
