/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Button,
  Rating,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateSchedule } from '../../service/api';
import { useAuth } from '../../context/AuthContext';

function SchedulingCard({ appointment }) {
  const { userInfo } = useAuth();

  console.log('USER INFO', userInfo);

  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(appointment.rating || null);
  const [isRatingEditable, setIsRatingEditable] = useState(appointment.rating === null);
  const [isRatingSelected, setIsRatingSelected] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  const handleEditClick = () => {
    if (appointment.status === 'Agendado') {
      navigate(`/agendar?scheduleId=${appointment.id}`);
    }
  };

  const handleRatingChange = (event, newValue) => {
    setUserRating(newValue);
    setIsRatingSelected(true); // Habilitar o botão de avaliação quando o usuário selecionar uma quantidade de estrelas
  };

  const handleSaveRating = async () => {
    if (appointment.status === 'Finalizado') {
      try {
        await updateSchedule(appointment.id, { rating: userRating });
        setSnackbarMessage('Avaliação salva com sucesso!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setIsRatingEditable(false);
      } catch (error) {
        console.error('Erro ao salvar avaliação:', error);
        setSnackbarMessage('Erro ao salvar avaliação. Tente novamente mais tarde.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarMessage("Você só pode avaliar agendamentos com status 'Finalizado'");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAddEventToUserCalendar = async () => {
    // Verificar possibilidades de envio do evento. Tem o endpoint e tem a url direto do front.
    // Precisava de mais tempo pra ver como funciona agora com o OAuth
    // const event = {
    //   summary: 'Corte de cabelo',
    //   location: 'Localização fake',
    //   description: 'Descrição qualquer',
    //   start: {
    //     dateTime: '2024-03-24T09:00:00',
    //     timeZone: 'America/Sao_Paulo',
    //   },
    //   end: {
    //     dateTime: '2024-03-24T10:00:00',
    //     timeZone: 'America/Sao_Paulo',
    //   },
    //   attendees: [{ email: 'test@email.com' }],
    // };
    // await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${userInfo.credential}`,
    //   },
    //   body: JSON.stringify(event),
    // })
    //   .then((data) => data.json())
    //   .then((data) => console.log(data))
    //   .catch((err) => console.log(err));
    // const { data } = await addScheduleToCalendar(1);
    // console.log('DATA', data);
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Agendamento N#{appointment.id}:
          </Typography>
          <Typography variant="body1" component="p">
            <strong>Data:</strong> {appointment.date}
            <br />
            <strong>Hora:</strong> {appointment.time}
            <br />
            <strong>Serviço:</strong> {appointment.service_name}
            <br />
            <strong>Barbeiro:</strong> {appointment.barber_name}
            <br />
            <strong>Status:</strong> {appointment.status}
            <br />
            <strong>Valor:</strong> R${appointment.service_price}
          </Typography>
        </CardContent>
        <CardActions>
          {isRatingEditable && appointment.status === 'Finalizado' && (
            <>
              <Rating
                name={`rating-${appointment.id}`}
                value={userRating}
                onChange={handleRatingChange}
                max={5} // Definindo o número máximo de estrelas como 5
              />
              {isRatingSelected && ( // Exibir o botão de avaliação somente quando uma quantidade de estrelas for selecionada
                <Button size="small" color="primary" onClick={handleSaveRating}>
                  Avaliar
                </Button>
              )}
            </>
          )}
          {!isRatingEditable && appointment.status === 'Finalizado' && (
            <Rating name={`rating-${appointment.id}`} value={userRating} readOnly max={5} />
          )}
          {appointment.status === 'Agendado' && (
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button size="small" color="primary" onClick={handleEditClick}>
                Editar
              </Button>
              <Button size="small" color="primary" onClick={handleAddEventToUserCalendar}>
                ADICIONAR AO GOOGLE CALENDAR
              </Button>
            </Box>
          )}
        </CardActions>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default SchedulingCard;
