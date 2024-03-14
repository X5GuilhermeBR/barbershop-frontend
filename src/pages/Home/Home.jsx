import { Card, CardContent, Container, Grid, Typography } from '@mui/material';
import React from 'react';

function HomePage() {
  // Exemplo de lista de agendamentos
  const appointments = [
    {
      date: '14/03/2024',
      time: '10:00',
      service: 'Corte de Cabelo',
      barber: 'João',
    },
    {
      date: '14/03/2024',
      time: '14:00',
      service: 'Barba',
      barber: 'Pedro',
    },
    {
      date: '14/03/2024',
      time: '16:00',
      service: 'Corte e Barba',
      barber: 'Mateus',
    },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Bem-vindo!
      </Typography>
      <Grid container spacing={3}>
        {appointments.map((appointment, index) => (
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Agendamento {index + 1}:
                </Typography>
                <Typography variant="body1" component="p">
                  <strong>Data:</strong> {appointment.date}
                  <br />
                  <strong>Hora:</strong> {appointment.time}
                  <br />
                  <strong>Serviço:</strong> {appointment.service}
                  <br />
                  <strong>Barbeiro:</strong> {appointment.barber}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default HomePage;
