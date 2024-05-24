/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  Snackbar,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { updateSchedule } from '../../service/api';
import colors from '../../utils/colors';
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
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempRating, setTempRating] = useState(null); // Temporarily store the rating

  const handleEditAppointment = (appoin) => {
    if (appointment.status === 'Agendado') {
      navigate(`/novo-agendamento?scheduleId=${appoin.id}`);
    }
  };

  const handleRatingChange = (event, newValue) => {
    setTempRating(newValue); // Store the rating temporarily
    setIsRatingSelected(true);
  };

  const handleSaveRating = async () => {
    if (appointment.status === 'Finalizado') {
      try {
        setUserRating(tempRating); // Save the rating locally
        await updateSchedule(appointment.id, { rating: tempRating }); // Update the rating in the database
        setSnackbarMessage('Avaliação salva com sucesso!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setIsRatingEditable(false);
        setIsModalOpen(false);
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
              userRating !== null ? (
                <Rating
                  name="half-rating-read"
                  value={userRating}
                  readOnly
                  style={{ color: colors.second }}
                  precision={0.5}
                />
              ) : (
                <>
                  <Button
                    variant="contained"
                    style={{
                      color: 'black',
                      border: 'none',
                      backgroundColor: colors.second,
                      marginBottom: '4px',
                    }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    AVALIAR ATENDIMENTO
                  </Button>
                  <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <DialogTitle>Avaliar Atendimento</DialogTitle>
                    <DialogContent>
                      <p>Por favor, avalie o atendimento com as estrelas abaixo:</p>
                      <Rating
                        name="half-rating"
                        value={tempRating}
                        onChange={handleRatingChange}
                        style={{ color: colors.second }}
                        precision={0.5}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setIsModalOpen(false)} color="primary">
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSaveRating}
                        color="primary"
                        disabled={!isRatingSelected}
                      >
                        Salvar Avaliação
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )
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
