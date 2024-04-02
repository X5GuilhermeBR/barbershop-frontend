/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Alert, Card, CardActions, CardContent, Grid, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { updateSchedule } from '../../service/api';
import colors from '../../utils/colors';

const StyledGridItem = styled(Grid)`
  margin-bottom: 20px;
`;

const StyledCard = styled(Card)`
  border: 1px solid #e0e0e0;
  background-color: ${colors.primary};
  border-radius: 15px;
`;

const StyledCardContent = styled(CardContent)`
  padding: 16px;
  color: ${colors.primaryText};

  h2 {
    font-size: 26px;
    margin-bottom: 10px;
  }

  p {
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

const RatingContainer = styled.div`
  background-color: ${colors.secondary};
  padding: 10px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
`;

const StyledCardActions = styled(CardActions)`
  padding: 16px;
  justify-content: space-between;
  background-color: ${colors.secundary};
`;

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
          <h2>Agendamento N#{appointment.id}:</h2>
          <p>
            <strong>Data:</strong> {appointment.date}
            <br />
            <strong>Hora:</strong> {appointment.time}
            <br />
            <strong>Serviço:</strong> {appointment.service_name}
            <br />
            <strong>Barbeiro:</strong> {appointment.barber_name}
            <br />
          </p>
        </StyledCardContent>
        <StyledCardActions>
          {/* {isRatingEditable && appointment.status === 'Finalizado' && (
            <RatingContainer>
              <Rating
                name={`rating-${appointment.id}`}
                value={userRating}
                onChange={handleRatingChange}
                max={5}
              />
              {isRatingSelected && (
                <Button size="small" color="primary" onClick={handleSaveRating}>
                  Avaliar
                </Button>
              )}
            </RatingContainer>
              )} 
          {!isRatingEditable && appointment.status === 'Finalizado' && (
            <RatingContainer>
              <Rating name={`rating-${appointment.id}`} value={userRating} readOnly max={5} />
            </RatingContainer>
          )}
          {appointment.status === 'Agendado' && (
            <Button size="small" color="primary" onClick={handleEditClick}>
              Editar
            </Button>
          )} */}
          <div>
            <p>{appointment.type}</p>
            <p>R${appointment.service_price}</p>
          </div>
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
