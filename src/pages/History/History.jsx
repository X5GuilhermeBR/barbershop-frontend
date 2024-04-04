/* eslint-disable no-param-reassign */
import HistoryIcon from '@mui/icons-material/History';
import { Container, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import SchedulingCard from '../../components/SchedulingCard/SchedulingCard';
import { useAuth } from '../../context/AuthContext';
import { checkScheduleById } from '../../service/api';
import { Divider, HistoryTitle } from './HistoryStyled';

function History() {
  const { userInfo } = useAuth();
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [noAppointments, setNoAppointments] = useState(false);
  const [maxMonth, setMaxMonth] = useState('');

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    setMaxMonth(`${year}-${month}`);
  }, []);

  useEffect(() => {
    async function fetchScheduledAppointments() {
      if (userInfo && userInfo.id) {
        const { data } = await checkScheduleById(startDate, endDate, userInfo.id);
        // Ordena os agendamentos por data antes de setá-los
        const sortedAppointments = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setScheduledAppointments(sortedAppointments);
        setNoAppointments(sortedAppointments.length === 0);
      }
    }

    fetchScheduledAppointments();
  }, [userInfo, startDate, endDate]);

  useEffect(() => {
    function setInitialAndEndDate() {
      if (startDate && endDate) {
        return;
      }

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
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
    if (selectedMonthYear <= maxMonth) {
      const [year, month] = selectedMonthYear.split('-');
      const firstDay = `${year}-${month}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const lastDayOfMonth = `${year}-${month}-${lastDay}`;
      setStartDate(firstDay);
      setEndDate(lastDayOfMonth);
    }
  };

  const formatWeekdayDateMonthYear = (dateString) => {
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    const date = new Date(dateString);
    const day = date.getDate() + 1; // Adiciona um dia ao título
    const weekday = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${weekday} - ${day} de ${month} de ${year}`;
  };

  const groupedAppointments = scheduledAppointments.reduce((grouped, appointment) => {
    const date = new Date(appointment.date);
    const dayOfWeek = date.getDay();
    if (!grouped[dayOfWeek]) {
      grouped[dayOfWeek] = [];
    }
    grouped[dayOfWeek].push(appointment);
    return grouped;
  }, {});

  // Ordenar os grupos de agendamentos por data
  const sortedGroupedAppointments = Object.entries(groupedAppointments).sort((a, b) => {
    const dateA = new Date(a[1][0].date);
    const dateB = new Date(b[1][0].date);
    return dateA - dateB;
  });

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
            <Grid item xs={12}>
              <TextField
                id="date"
                label="Filtrar por Mês e Ano"
                type="month"
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                value={startDate.slice(0, 7)}
                inputProps={{
                  max: maxMonth,
                }}
              />
            </Grid>
            {sortedGroupedAppointments.map(([dayOfWeek, appointments]) => (
              <Grid item xs={12} key={dayOfWeek}>
                <Divider />
                <HistoryTitle>{formatWeekdayDateMonthYear(appointments[0].date)}</HistoryTitle>
                <Grid container spacing={2}>
                  {appointments.map((appointment) => (
                    <Grid item key={appointment.id} xs={12}>
                      <SchedulingCard appointment={appointment} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
            {noAppointments && (
              <Grid container justifyContent="center" style={{ marginTop: '1rem' }}>
                <Typography variant="h6">
                  Você não possui histórico de atendimento neste mês.
                </Typography>
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
