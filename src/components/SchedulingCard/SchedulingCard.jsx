/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Alert, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateSchedule } from '../../service/api';
import {
  StyledCard,
  StyledCardActions,
  StyledCardContent,
  StyledChip,
  StyledGridItem,
} from './SchedulingCardStyles';

function SchedulingCard({ appointment }) {
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(appointment.rating || null);
  const [isRatingEditable, setIsRatingEditable] = useState(appointment.rating === null);
  const [isRatingSelected, setIsRatingSelected] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  const handleEditClick = () => {
    if (appointment.status === 'Agendado') {
      navigate(`/novo-agendamento?scheduleId=${appointment.id}`);
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

  return (
    <StyledGridItem item xs={12} sm={6} md={4}>
      <StyledCard variant="outlined">
        <StyledCardContent>
          <h2>Agendamento N#{appointment.id}</h2>
          <StyledChip label={appointment.status.toUpperCase()} status={appointment.status} />
          <p>
            <strong>Data:</strong> {appointment.date}
            <br />
            <strong>Hora:</strong> {appointment.time}h
            <br />
            <strong>Serviço:</strong> {appointment.service_name}
            <br />
            <strong>Barbeiro:</strong> {appointment.barber_name}
            <br />
          </p>
        </StyledCardContent>
        <StyledCardActions>
          <p>{appointment.type.toUpperCase()}</p>
          <StyledChip label={`R$${appointment.service_price}`} />
        </StyledCardActions>
      </StyledCard>
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
    </StyledGridItem>
  );
}

export default SchedulingCard;
