import HistoryIcon from '@mui/icons-material/History';
import { Container, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import SchedulingCard from '../../components/SchedulingCard/SchedulingCard';
import { useAuth } from '../../context/AuthContext';
import { checkScheduleById } from '../../service/api';

function History() {
  const { userInfo } = useAuth();
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [noAppointments, setNoAppointments] = useState(false);

  useEffect(() => {
    async function fetchScheduledAppointments() {
      if (userInfo && userInfo.id) {
        const { data } = await checkScheduleById(startDate, endDate, userInfo.id);
        setScheduledAppointments(data);
        setNoAppointments(data.length === 0);
      }
    }

    fetchScheduledAppointments();
  }, [userInfo, startDate, endDate]);

  useEffect(() => {
    // Função para definir a data inicial e final do mês atual
    function setInitialAndEndDate() {
      if (startDate && endDate) {
        return;
      }

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se o mês for menor que 10
      const firstDay = `${year}-${month}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const lastDayOfMonth = `${year}-${month}-${lastDay}`;
      setStartDate(firstDay);
      setEndDate(lastDayOfMonth);
    }

    setInitialAndEndDate();
  }, [startDate, endDate]);

  const handleDateChange = (event) => {
    const selectedMonthYear = event.target.value;
    const [year, month] = selectedMonthYear.split('-');
    const selectedDate = new Date(year, month - 1); // Mês - 1 porque os meses são indexados de 0 a 11
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      const firstDay = `${year}-${month}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const lastDayOfMonth = `${year}-${month}-${lastDay}`;
      setStartDate(firstDay);
      setEndDate(lastDayOfMonth);
    }
  };

  return (
    <>
      <Header icon={<HistoryIcon />} title="Meu Histórico" />
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
            <Grid item xs={12} style={{ width: '100%' }}>
              <TextField
                id="date"
                label="Filtrar por Mês e Ano"
                type="month"
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth // Ocupa todo o tamanho disponível horizontalmente
                value={startDate.slice(0, 7)} // Ajusta para exibir apenas o ano e o mês
              />
            </Grid>
            {noAppointments ? (
              <Grid container justifyContent="center">
                <Typography variant="h6">
                  Você não possui histórico de atendimento neste mês.
                </Typography>
              </Grid>
            ) : (
              <Grid container spacing={2} justifyContent="center">
                {scheduledAppointments.map((appointment) => (
                  <SchedulingCard key={appointment.id} appointment={appointment} />
                ))}
              </Grid>
            )}
          </Grid>
        </Container>
      </Grid>
      <FooterNavigation style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }} />
    </>
  );
}

export default History;
