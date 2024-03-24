import HistoryIcon from '@mui/icons-material/History';
import { Container, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import SchedulingCard from '../../components/SchedulingCard/SchedulingCard';
import { useAuth } from '../../context/AuthContext';
import { checkScheduleById } from '../../service/api';

function Schedule() {
  const { userInfo } = useAuth();
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [noAppointments, setNoAppointments] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const maxDate = new Date(currentDate.getTime() + 45 * 24 * 60 * 60 * 1000); // 45 dias à frente
    const formattedMaxDate = maxDate.toISOString().split('T')[0]; // Formata a data para o formato 'YYYY-MM-DD'
    setSelectedDate(formattedMaxDate);
  }, []);

  useEffect(() => {
    async function fetchScheduledAppointments() {
      if (userInfo && userInfo.id) {
        const { data } = await checkScheduleById(selectedDate, selectedDate, userInfo.id);
        // Ordena os agendamentos pela data em ordem crescente (da mais antiga para a mais recente)
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setScheduledAppointments(data);
        setNoAppointments(data.length === 0);
      }
    }

    fetchScheduledAppointments();
  }, [userInfo, selectedDate]);

  const handleDateChange = (event) => {
    const selectedDateValue = event.target.value;
    setSelectedDate(selectedDateValue);
  };

  const formatWeekdayDateMonthYear = (dateString) => {
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${dayOfWeek}, ${day}/${month}/${year}`;
  };

  return (
    <>
      <Header icon={<HistoryIcon />} title="Minha agenda" />
      <Grid
        container
        style={{
          marginBottom: '4rem',
          marginTop: '1rem',
          minHeight: 'calc(100vh - 64px)',
          flex: '1 0 auto',
        }}
      >
        <Container>
          <Grid container direction="column" style={{ marginBottom: '5rem', flex: '1 0 auto' }}>
            <Grid item xs={12}>
              <TextField
                id="date"
                label="Selecione uma data"
                type="date"
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                value={selectedDate}
                inputProps={{
                  min: new Date().toISOString().split('T')[0], // Data atual
                  max: new Date(new Date().getTime() + 45 * 24 * 60 * 60 * 1000) // 45 dias à frente
                    .toISOString()
                    .split('T')[0],
                }}
              />
            </Grid>
            {scheduledAppointments.map((appointment) => (
              <Grid item xs={12} key={appointment.id}>
                <Typography variant="h6" style={{ marginTop: '1rem' }}>
                  {formatWeekdayDateMonthYear(appointment.date)}
                </Typography>
                <SchedulingCard appointment={appointment} />
              </Grid>
            ))}
            {noAppointments && (
              <Grid container justifyContent="center" style={{ marginTop: '1rem' }}>
                <Typography variant="h6">Você não possui agendamentos nesta data.</Typography>
              </Grid>
            )}
          </Grid>
        </Container>
      </Grid>
      <FooterNavigation style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }} />
    </>
  );
}

export default Schedule;
