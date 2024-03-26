/* eslint-disable no-undef */
import ArticleIcon from '@mui/icons-material/Article';
import { Button, Container, Grid, MenuItem, Select, Snackbar, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import SelectComponent from '../../components/SelectComponent/SelectComponent';
import { useAuth } from '../../context/AuthContext';
import {
  createSchedule,
  getByProfile,
  getSchedule,
  getScheduleById,
  getServices,
  updateSchedule,
} from '../../service/api';
import { getCurrentDate, getDisabledHours, getFutureDate } from '../../utils/generalFunctions';

function NewSchedule() {
  const [barbers, setBarbers] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuth();

  useEffect(() => {
    if (userInfo && userInfo.profile === 'client') {
      setSelectedClient(userInfo.id);
    } else if (userInfo && userInfo.profile === 'barber') {
      setSelectedBarber(userInfo.id);
    }
  }, [userInfo?.profile]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: barbersData } = await getByProfile('barbers');
        setBarbers(barbersData);

        const { data: clientsData } = await getByProfile('clients');
        setClients(clientsData);

        const { data: servicesData } = await getServices();
        setServices(servicesData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }

    fetchData();
  }, [userInfo?.profile]);

  useEffect(() => {
    const fetchScheduleData = async () => {
      if (selectedBarber && selectedService && selectedDate) {
        try {
          const { data } = await getSchedule(selectedDate, selectedDate, userInfo.id);
          setSchedule(data);
        } catch (error) {
          console.error('Erro ao buscar agendamentos:', error);
        }
      }
    };

    fetchScheduleData();
  }, [selectedBarber, selectedClient, selectedService, selectedDate, userInfo?.profile]);

  useEffect(() => {
    setIsFormValid(
      selectedDate &&
        selectedHour &&
        ((userInfo?.profile === 'barber' && selectedClient) ||
          (userInfo?.profile === 'client' && selectedBarber))
    );
  }, [
    selectedBarber,
    selectedClient,
    selectedService,
    selectedDate,
    selectedHour,
    userInfo?.profile,
  ]);

  useEffect(() => {
    // Inicialize o estado selectedClient ao carregar a página de edição
    const fetchScheduleById = async () => {
      const params = new URLSearchParams(location.search);
      const scheduleId = params.get('scheduleId');
      if (scheduleId) {
        try {
          const { data } = await getScheduleById(scheduleId);
          setSelectedDate(data.date);
          setSelectedHour(data.time);
          let selectedBarberId = null;
          if (userInfo?.profile === 'barber') {
            selectedBarberId = userInfo.id;
          } else {
            selectedBarberId = data.id_user_barber;
          }
          const selectedBarberData = barbers.find((barber) => barber.user_id === selectedBarberId);
          setSelectedBarber(selectedBarberData);
          const selectedServiceData = services.find((service) => service.id === data.id_service);
          setSelectedService(selectedServiceData);
          setIsEditing(true);
          setSelectedClient(data.id_user_client);
        } catch (error) {
          console.error('Erro ao carregar agendamento:', error);
        }
      }
    };

    console.log(selectedBarber, 'barbeiro selecionado');

    fetchScheduleById();
  }, [barbers, services, location.search, userInfo]);

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const scheduleData = {
      id_user_client: userInfo.profile === 'client' ? userInfo.id : selectedClient.user_id,
      id_user_barber: userInfo.profile === 'barber' ? userInfo.id : selectedBarber.user_id,
      type: 'Marcado',
      date: selectedDate,
      time: selectedHour,
      id_service: selectedService.id,
      status: 'Agendado',
    };

    try {
      if (isEditing) {
        const params = new URLSearchParams(location.search);
        const scheduleId = params.get('scheduleId');
        if (scheduleId) {
          // Aqui está o problema, você não está definindo a variável scheduleId
          await updateSchedule(scheduleId, scheduleData);
          setMessage(
            'Agendamento atualizado com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
          );
          setSnackbarOpen(true);
        } else {
          // Lidere com o caso em que scheduleId não está definido
          console.error('scheduleId não está definido');
        }
      } else {
        await createSchedule(scheduleData);
        setMessage(
          'Agendamento realizado com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
        );
        setSnackbarOpen(true);
      }
      setIsSubmitting(false);
      setSchedule([]);
      setTimeout(() => navigate('/inicio'), 3000);
    } catch (error) {
      console.error('Erro ao criar/atualizar agendamento:', error);
      setMessage('Erro ao criar/atualizar agendamento. Por favor, tente novamente.');
      setSnackbarOpen(true);
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async () => {
    const params = new URLSearchParams(location.search);
    const scheduleId = params.get('scheduleId');

    try {
      await updateSchedule(scheduleId, { status: 'Cancelado' });
      setMessage(
        'Agendamento cancelado com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
      );
      setSnackbarOpen(true);
      setTimeout(() => navigate('/inicio'), 3000);
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      setMessage('Erro ao cancelar agendamento. Por favor, tente novamente.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Header icon={<ArticleIcon />} title="Novo Agendamento" />
      <Grid item style={{ marginBottom: '2rem', marginTop: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container maxWidth="sm" textAlign="center">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userInfo?.profile === 'barber' ? (
              <SelectComponent
                label="Cliente"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                items={clients}
                disabled={isSubmitting}
              />
            ) : (
              <SelectComponent
                label="Barbeiro"
                value={selectedBarber}
                onChange={(e) => setSelectedBarber(e.target.value)}
                items={barbers}
                disabled={isSubmitting}
              />
            )}
            <SelectComponent
              label="Serviço"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              items={services}
              disabled={isSubmitting}
            />
            <TextField
              label="Data"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getCurrentDate(), max: getFutureDate() }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={isSubmitting}
            />
            <Select
              label="Hora"
              variant="outlined"
              fullWidth
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              disabled={isSubmitting}
            >
              <MenuItem value="">Selecione uma hora</MenuItem>
              {getDisabledHours(schedule).map((hour) => (
                <MenuItem key={hour.time} value={hour.time} disabled={hour.disabled}>
                  {hour.time}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{ marginBottom: '2rem', marginTop: '1rem', zIndex: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              style={{ width: '100%', marginBottom: '1rem' }}
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
            >
              {isEditing ? 'Atualizar' : 'Agendar'}
            </Button>
            {location.search && (
              <Button
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
                style={{ width: '100%' }}
                onClick={handleCancelAppointment}
                disabled={!location.search || isSubmitting}
              >
                Cancelar Atendimento
              </Button>
            )}
          </Grid>
        </Container>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
          {message}
        </MuiAlert>
      </Snackbar>
      <FooterNavigation />
    </>
  );
}

export default NewSchedule;
