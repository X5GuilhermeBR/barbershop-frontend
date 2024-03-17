/* eslint-disable react/prop-types */
import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

function SchedulingCard({ appointment }) {
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
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default SchedulingCard;
