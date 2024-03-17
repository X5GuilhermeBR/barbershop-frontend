import ArticleIcon from '@mui/icons-material/Article';
import { Button, Container, Grid, MenuItem, Select, Snackbar, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import SelectComponent from '../../components/SelectComponent/SelectComponent';
import { useAuth } from '../../context/AuthContext';
import { createSchedule, getBarbers, getSchedule, getServices } from '../../service/api';
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
  const [isSubmitting, setIsSubmitting] = useState(false); // Variável de estado para controlar o estado de envio
  const navigate = useNavigate(); // Hook useNavigate para redirecionamento
  const { userInfo } = useAuth();

  useEffect(() => {
    async function fetchBarbers() {
      const { data } = await getBarbers();
      setBarbers(data);
    }

    fetchBarbers();
  }, []);

  useEffect(() => {
    async function fetchServices() {
      const { data } = await getServices();
      setServices(data);
    }

    fetchServices();
  }, []);

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

  useEffect(() => {
    fetchScheduleData();
  }, [selectedBarber, selectedService, selectedDate]);

  useEffect(() => {
    setIsFormValid(selectedBarber && selectedService && selectedDate && selectedHour);
  }, [selectedBarber, selectedService, selectedDate, selectedHour]);

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
      // Verifica se o formulário é válido e se não está sendo enviado
      return;
    }

    setIsSubmitting(true); // Define isSubmitting como true para indicar que o formulário está sendo enviado
    const scheduleData = createScheduleObject();
    try {
      await createSchedule(scheduleData);
      setMessage(
        'Agendamento realizado com sucesso! Você será redirecionado para tela inicial em 3 segundos...'
      );
      setSnackbarOpen(true);
      setIsSubmitting(false); // Define isSubmitting como false após o envio bem-sucedido
      setSchedule([]);
      setTimeout(() => navigate('/inicio'), 3000); // Redireciona para "/inicio" após 3 segundos
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      setMessage('Erro ao criar agendamento. Por favor, tente novamente.');
      setSnackbarOpen(true);
      setIsSubmitting(false); // Define isSubmitting como false em caso de erro
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
              disabled={isSubmitting} // Desativa o campo enquanto estiver enviando
            />
            <SelectComponent
              label="Serviço"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              items={services}
              disabled={isSubmitting} // Desativa o campo enquanto estiver enviando
            />
            <TextField
              label="Data"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: getCurrentDate(),
                max: getFutureDate(),
              }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={isSubmitting} // Desativa o campo enquanto estiver enviando
            />
            <Select
              label="Hora"
              variant="outlined"
              fullWidth
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              disabled={isSubmitting} // Desativa o campo enquanto estiver enviando
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
          disabled={!isFormValid || isSubmitting} // Desativa o botão enquanto estiver enviando ou se o formulário não for válido
        >
          Agendar
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
