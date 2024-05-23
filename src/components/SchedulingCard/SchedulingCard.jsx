/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';

import { Alert, IconButton, Snackbar, Tooltip } from '@mui/material';
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

  const handleEditAppointment = (appoin) => {
    if (appointment.status === 'Agendado') {
      navigate(`/novo-agendamento?scheduleId=${appoin.id}`);
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

  const handleCancelAppointment = async () => {
    try {
      await updateSchedule(appointment.id, { status: 'Cancelado' });
      setSnackbarMessage('Agendamento cancelado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      setSnackbarMessage('Erro ao cancelar agendamento. Tente novamente mais tarde.');
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
          <StyledChip label={appointment.type.toUpperCase()} type={appointment.type} />
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
          <div>
            {appointment.status === 'Agendado' ? (
              <>
                <Tooltip title="Editar">
                  <IconButton color="primary" onClick={() => handleEditAppointment(appointment)}>
                    <EditIcon
                      fontSize="small"
                      style={{ cursor: 'pointer', color: 'white', marginRight: '12px' }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Calendário" style={{ cursor: 'pointer', color: 'white' }}>
                  <IconButton color="primary">
                    <CalendarTodayIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : appointment.status === 'Finalizado' ? (
              <p style={{ cursor: 'pointer', color: 'white' }}>AVALIAR ATENDIMENTO</p>
            ) : null}
          </div>

          <p style={{ color: 'green' }}>R${appointment.service_price},00 </p>
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
