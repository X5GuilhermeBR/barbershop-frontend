import ArticleIcon from '@mui/icons-material/Article';
import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  TextField,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
import colors from '../../utils/colors';
import { getCurrentDate, getDisabledHours, getFutureDate } from '../../utils/generalFunctions';

const StyledSelect = styled(Select)`
  background-color: white;
  color: black;
`;

const StyledMenuItem = styled(MenuItem)`
  color: black;
`;

const StyledTextField = styled(TextField)`
  background-color: white;
  color: black;
`;

const InfoText = styled.div`
  color: ${colors.third};
  font-size: 20px;
`;

const InfoContainer = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: ${colors.fourth};
  border-radius: 8px;
`;

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
  const [appointmentInfo, setAppointmentInfo] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [appointmentType, setAppointmentType] = useState('Marcado');
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuth();

  useEffect(() => {
    if (userInfo && userInfo.profile === 'client') {
      setSelectedClient(userInfo.id);
    } else if (userInfo && userInfo.profile === 'barber') {
      setSelectedBarber(userInfo.id);
    }
  }, [userInfo]);

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
  }, []);

  useEffect(() => {
    const fetchScheduleData = async () => {
      if (selectedBarber && selectedService && selectedDate) {
        try {
          let barberId = null;
          if (userInfo.profile === 'barber') {
            barberId = selectedBarber;
          } else {
            barberId = selectedBarber.user_id;
          }
          const { data } = await getSchedule(selectedDate, selectedDate, barberId);
          setSchedule(data);
        } catch (error) {
          console.error('Erro ao buscar agendamentos:', error);
        }
      }
    };

    fetchScheduleData();
  }, [selectedBarber, selectedService, selectedDate, userInfo.profile]);

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
    const generateAppointmentInfo = () => {
      const serviceName = selectedService ? selectedService.name : '';
      const formattedDate = new Date(selectedDate).toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const appointmentValue = selectedService ? selectedService.price : '';
      const appointmentTime = selectedHour || '';
      return `O serviço "${serviceName}" está agendado para ${formattedDate}, às ${appointmentTime}, com valor previsto de R$ ${appointmentValue}`;
    };

    setAppointmentInfo(generateAppointmentInfo());
  }, [selectedService, selectedDate, selectedHour]);

  useEffect(() => {
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
            setSelectedClient(data.id_user_client); // Usando o userId do cliente do agendamento
          } else {
            selectedBarberId = data.id_user_barber;
            setSelectedClient(userInfo?.id); // Usando o userId do próprio usuário (cliente)
          }
          const selectedBarberData = barbers.find((barber) => barber.user_id === selectedBarberId);
          setSelectedBarber(selectedBarberData);
          const selectedServiceData = services.find((service) => service.id === data.id_service);
          setSelectedService(selectedServiceData);
          setIsEditing(true);
        } catch (error) {
          console.error('Erro ao carregar agendamento:', error);
        }
      }
    };

    if (barbers.length > 0 && services.length > 0 && clients.length > 0) {
      fetchScheduleById();
    }
  }, [barbers, services, clients, location.search, userInfo]);

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const scheduleData = {
      id_user_client: userInfo.profile === 'client' ? userInfo.id : selectedClient.user_id,
      id_user_barber: userInfo.profile === 'barber' ? userInfo.id : selectedBarber.user_id,
      type: appointmentType,
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
          await updateSchedule(scheduleId, scheduleData);
          setMessage(
            'Agendamento atualizado com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
          );
          setSnackbarOpen(true);
        } else {
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

  const pageTitle = isEditing ? 'Editar Atendimento' : 'Novo Atendimento';

  return (
    <>
      <Header icon={<ArticleIcon />} title={pageTitle} />
      <Grid
        item
        style={{
          marginBottom: '2rem',
          marginTop: '2rem',
          flex: '1 0 auto',
          zIndex: 1,
          paddingBottom: '4rem',
        }}
      >
        <Container maxWidth="sm" textAlign="center">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userInfo?.profile === 'barber' && (
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <InfoText>Atendimento: </InfoText>
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="appointmentType"
                  name="appointmentType"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                >
                  <FormControlLabel value="Marcado" control={<Radio />} label="Marcado" />
                  <FormControlLabel value="Encaixe" control={<Radio />} label="Encaixe" />
                </RadioGroup>
              </FormControl>
            )}
            {userInfo?.profile === 'barber' ? (
              <SelectComponent
                label="Cliente"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                items={clients.filter((client) => !client.disable)}
                disabled={isSubmitting}
              />
            ) : (
              <SelectComponent
                label="Barbeiro"
                value={selectedBarber}
                onChange={(e) => setSelectedBarber(e.target.value)}
                items={barbers.filter((barber) => !barber.disable)}
                disabled={isSubmitting}
              />
            )}
            <SelectComponent
              label="Serviço"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              items={services.filter((service) => !service.disable)}
              disabled={isSubmitting}
            />

            <InfoText>Data: </InfoText>
            <StyledTextField
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getCurrentDate(), max: getFutureDate() }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={isSubmitting}
            />

            <InfoText>Hora: </InfoText>
            <StyledSelect
              variant="outlined"
              fullWidth
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              disabled={isSubmitting}
            >
              <MenuItem value="">Selecione uma hora</MenuItem>
              {getDisabledHours(schedule, appointmentType).map((hour) => (
                <StyledMenuItem key={hour.time} value={hour.time} disabled={hour.disabled}>
                  {hour.time}
                </StyledMenuItem>
              ))}
            </StyledSelect>
          </div>
          {selectedBarber && selectedService && selectedDate && selectedHour && (
            <InfoContainer>{appointmentInfo && appointmentInfo}</InfoContainer>
          )}

          <Button
            variant="contained"
            color={isFormValid || isEditing ? 'primary' : 'inherit'}
            size="large"
            fullWidth
            style={{
              width: '100%',
              marginBottom: '1rem',
              marginTop: '1rem',
              backgroundColor: isFormValid || isEditing ? colors.second : '#f0f0f0',
              color: 'black',
              height: '60px',
              fontWeight: 'bold',
            }}
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            {isEditing ? 'Atualizar' : 'Agendar'}
          </Button>
          {location.search && (
            <Button
              variant="outlined"
              style={{
                borderColor: colors.second,
                color: colors.second,
                height: '60px',
              }}
              size="large"
              fullWidth
              onClick={handleCancelAppointment}
              disabled={!location.search || isSubmitting}
            >
              Cancelar Atendimento
            </Button>
          )}
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
