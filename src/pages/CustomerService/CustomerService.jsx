/* eslint-disable no-nested-ternary */
import { Button, CircularProgress, Container, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { getScheduleById, updateSchedule } from '../../service/api';

function CustomerService() {
  const [clientName, setClientName] = useState('');
  const [barberName, setBarberName] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduleService, setScheduleService] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const scheduleId = params.get('scheduleId');

  useEffect(() => {
    if (scheduleId) {
      getScheduleById(scheduleId)
        .then((response) => {
          const scheduleData = response.data;
          setClientName(scheduleData.clientName);
          setBarberName(scheduleData.barberName);
          setScheduledTime(scheduleData.time);
          setScheduledDate(scheduleData.date);
          setScheduleService(scheduleData.serviceName);
          setScheduleStatus(scheduleData.status);
        })
        .catch((error) => {
          console.error('Error fetching schedule:', error);
          navigate('/agenda');
        });
    } else {
      navigate('/agenda');
    }
  }, [location.search, navigate]);

  const handleStartService = async () => {
    setIsProcessing(true);
    try {
      const updatedSchedule = await updateSchedule(scheduleId, {
        status: 'Em Andamento',
        started_service: new Date(),
      });
      console.log('Atendimento iniciado:', updatedSchedule);
      setIsProcessing(false);
    } catch (error) {
      console.error('Erro ao iniciar o atendimento:', error);
      setIsProcessing(false);
    }
  };

  const handleFinishService = async () => {
    setIsProcessing(true);
    try {
      const updatedSchedule = await updateSchedule(scheduleId, {
        status: 'Finalizado',
        finished_service: new Date(),
      });
      console.log('Atendimento finalizado:', updatedSchedule);
      setIsProcessing(false);
    } catch (error) {
      console.error('Erro ao finalizar o atendimento:', error);
      setIsProcessing(false);
    }
  };

  const handleEditService = () => {
    // Adicione aqui a lógica para redirecionar para a página de edição de atendimento
    navigate(`/editar-atendimento/${scheduleId}`);
  };

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
            Detalhes do Serviço - Status: {scheduleStatus}
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
          {isProcessing ? (
            <Button disabled fullWidth style={{ marginTop: '1rem' }}>
              <CircularProgress size={24} /> Processando...
            </Button>
          ) : scheduleStatus === 'Em Andamento' ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleFinishService}
              fullWidth
              style={{ marginTop: '1rem' }}
            >
              Finalizar Atendimento
            </Button>
          ) : scheduleStatus === 'Finalizado' ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditService}
              fullWidth
              style={{ marginTop: '1rem' }}
            >
              Editar Atendimento
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartService}
              fullWidth
              style={{ marginTop: '1rem' }}
            >
              Iniciar Atendimento
            </Button>
          )}
        </Container>
      </Grid>
    </>
  );
}

export default CustomerService;
