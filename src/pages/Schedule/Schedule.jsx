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
  getBarbers,
  getSchedule,
  getScheduleById,
  getServices,
  updateSchedule, // Importa a função para atualizar a agenda
} from '../../service/api';
import { getCurrentDate, getDisabledHours, getFutureDate } from '../../utils/generalFunctions';

function Schedule() {
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuth();

  useEffect(() => {
    async function fetchBarbers() {
      const { data } = await getBarbers();
      setBarbers(data);
    }

    async function fetchServices() {
      const { data } = await getServices();
      setServices(data);
    }

    fetchBarbers();
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchScheduleData = async () => {
      if (selectedBarber && selectedService && selectedDate) {
        try {
          const { data } = await getSchedule(selectedDate, selectedDate, selectedBarber.user_id);
          setSchedule(data);
        } catch (error) {
          console.error('Erro ao buscar agendamentos:', error);
        }
      }
    };

    fetchScheduleData();
  }, [selectedBarber, selectedService, selectedDate]);

  useEffect(() => {
    setIsFormValid(selectedBarber && selectedService && selectedDate && selectedHour);
  }, [selectedBarber, selectedService, selectedDate, selectedHour]);

  useEffect(() => {
    // Verifica se existe um parâmetro 'scheduleId' na query string
    const params = new URLSearchParams(location.search);
    const scheduleId = params.get('scheduleId');

    if (scheduleId) {
      const fetchScheduleById = async () => {
        try {
          const { data } = await getScheduleById(scheduleId);
          setSelectedDate(data.date);
          setSelectedHour(data.time);

          // Encontra o barbeiro correspondente com base no ID recebido do response
          const selectedBarberData = barbers.find(
            (barber) => barber.user_id === data.id_user_barber
          );
          setSelectedBarber(selectedBarberData);

          // Encontra o serviço correspondente com base no ID recebido do response
          const selectedServiceData = services.find((service) => service.id === data.id_service);
          setSelectedService(selectedServiceData);
        } catch (error) {
          console.error('Erro ao carregar agendamento:', error);
        }
      };

      fetchScheduleById();
    }
  }, [barbers, services, location.search]);

  const createScheduleObject = () => ({
    id_user_client: userInfo.id,
    id_user_barber: selectedBarber.user_id,
    type: 'Agendado',
    date: selectedDate,
    time: selectedHour,
    id_service: selectedService.id,
    status: 'Agendado',
  });

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) {
      return;
    }

    const params = new URLSearchParams(location.search);
    const scheduleId = params.get('scheduleId');

    setIsSubmitting(true);
    const scheduleData = createScheduleObject();
    try {
      if (location.search) {
        // Se houver uma query string, atualiza a agenda
        await updateSchedule(scheduleId, scheduleData);
        setMessage(
          'Agendamento atualizado com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
        );
      } else {
        // Se não houver query string, cria uma nova agenda
        await createSchedule(scheduleData);
        setMessage(
          'Agendamento realizado com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
        );
      }
      setSnackbarOpen(true);
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
            <SelectComponent
              label="Barbeiro"
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              items={barbers}
              disabled={isSubmitting}
            />
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
        </Container>
      </Grid>
      <Grid item style={{ position: 'sticky', bottom: '5rem', zIndex: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          style={{ width: 'calc(100% - 2rem)', margin: '0 1rem' }}
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          {location.search ? 'Atualizar' : 'Agendar'}
        </Button>
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

export default Schedule;
