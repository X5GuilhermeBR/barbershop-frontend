import HistoryIcon from '@mui/icons-material/History'
import { Container, Grid } from '@mui/material'
import React from 'react'
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation'
import Header from '../../components/Header/Header'
import SchedulingCard from '../../components/SchedulingCard/SchedulingCard'

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
  const appointmentHistory = getAppointmentHistory();

  return(
     <>
    <Header icon={<HistoryIcon />} title="Meu Histórico" />
      <Grid item style={{ marginBottom: '4rem', marginTop: '1rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container>
      <Grid
        container
        direction="column"
        style={{ marginBottom: '5rem', flex: '1 0 auto', zIndex: 1 }}
      >
        <Grid container spacing={2} justifyContent="center">
          {appointmentHistory.map((appointment) => (
            <SchedulingCard key={appointment.id} appointment={appointment} />
          ))}
        </Grid>
      </Grid>
      </Container>
      </Grid>
      <FooterNavigation style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }} />
      </>
  );
}

export default History;
