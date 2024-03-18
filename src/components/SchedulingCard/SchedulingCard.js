/* eslint-disable react/prop-types */
import React from 'react';
import { Card, CardContent, CardActions, Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SchedulingCard({ appointment }) {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/agendar?scheduleId=${appointment.id}`);
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
            
          </Typography>
        </CardContent>
        {appointment.status === 'Agendado' && (
        <CardActions>
          <Button size="small" color="primary" onClick={handleEditClick}>
            Editar
          </Button>
        </CardActions>
        )}
      </Card>
    </Grid>
  );
}

export default SchedulingCard;
