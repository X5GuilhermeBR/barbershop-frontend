import { Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';

// Função para gerar dados de exemplo para o histórico de atendimentos
function getAppointmentHistory() {
  return [
    { barber: 'Barbeiro 1', date: '2024-03-15', time: '14:30', servicePrice: 'R$ 50,00' },
    { barber: 'Barbeiro 2', date: '2024-03-16', time: '10:00', servicePrice: 'R$ 40,00' },
    { barber: 'Barbeiro 3', date: '2024-03-17', time: '15:45', servicePrice: 'R$ 60,00' },
    { barber: 'Barbeiro 1', date: '2024-03-15', time: '14:30', servicePrice: 'R$ 50,00' },
    { barber: 'Barbeiro 2', date: '2024-03-16', time: '10:00', servicePrice: 'R$ 40,00' },
    { barber: 'Barbeiro 3', date: '2024-03-17', time: '15:45', servicePrice: 'R$ 60,00' },
    { barber: 'Barbeiro 1', date: '2024-03-15', time: '14:30', servicePrice: 'R$ 50,00' },
    { barber: 'Barbeiro 2', date: '2024-03-16', time: '10:00', servicePrice: 'R$ 40,00' },
    { barber: 'Barbeiro 3', date: '2024-03-17', time: '15:45', servicePrice: 'R$ 60,00' },
  ];
}

function History() {
  // Obtém o histórico de atendimentos
  const appointmentHistory = getAppointmentHistory();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Grid
        container
        direction="column"
        style={{ marginBottom: '5rem', flex: '1 0 auto', zIndex: 1 }}
      >
        <Grid container spacing={2} justifyContent="center">
          {appointmentHistory.map((appointment) => (
            <Grid item xs={12} md={6} lg={4}>
              <Card style={{ height: '100%' }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                  >{`Barbeiro: ${appointment.barber}`}</Typography>
                  <Typography variant="body1">{`Data: ${appointment.date}`}</Typography>
                  <Typography variant="body1">{`Hora: ${appointment.time}`}</Typography>
                  <Typography variant="body1">{`Valor do serviço: ${appointment.servicePrice}`}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <FooterNavigation style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }} />
    </div>
  );
}

export default History;
