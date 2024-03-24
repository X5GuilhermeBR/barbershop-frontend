/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import HistoryIcon from '@mui/icons-material/History';
import { Container, Divider, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { useAuth } from '../../context/AuthContext';
import { checkScheduleById } from '../../service/api';

function Schedule() {
  const { userInfo } = useAuth();
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [noAppointments, setNoAppointments] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // Formata a data para o formato 'YYYY-MM-DD'
    setSelectedDate(formattedCurrentDate);
  }, []);

  useEffect(() => {
    async function fetchScheduledAppointments() {
      if (userInfo && userInfo.id) {
        const { data } = await checkScheduleById(selectedDate, selectedDate, userInfo.id);
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
    date.setDate(date.getDate() + 1); // Adiciona um dia à data
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${dayOfWeek}, ${day}/${month}/${year}`;
  };

  const formatHour = (hour) => (hour < 10 ? `0${hour}:00` : `${hour}:00`);

  const availableHours = Array.from({ length: 11 }, (_, index) => index + 9);

  const groupedAppointmentsByDate = scheduledAppointments.reduce((grouped, appointment) => {
    const { date } = appointment;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(appointment);
    return grouped;
  }, {});

  const renderAppointmentOrVago = (hour, appointments) => {
    const appointment = appointments.find(
      (appoint) => parseInt(appoint.time.split(':')[0], 10) === hour
    );
    if (appointment) {
      return (
        <>
          <Typography variant="body1">{`Cliente: ${appointment.client_name}`}</Typography>
          <Typography variant="body2">{`Serviço: ${appointment.service_name}`}</Typography>
          <Typography variant="body2">{`Valor: ${appointment.service_price}`}</Typography>
          <Typography variant="body2">{`Status: ${appointment.status}`}</Typography>
          <Typography variant="body2">{`Type: ${appointment.type}`}</Typography>
        </>
      );
    }
    return (
      <Typography variant="body1" style={{ textAlign: 'center' }}>
        Horário vago
      </Typography>
    );
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
            {Object.entries(groupedAppointmentsByDate).map(([date, appointments]) => (
              <Grid item xs={12} key={date}>
                <Typography variant="h6" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                  {formatWeekdayDateMonthYear(date)}
                </Typography>
                {availableHours.map((hour) => (
                  <Paper elevation={3} style={{ padding: '1rem', marginBottom: '1rem' }} key={hour}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" style={{ marginRight: '1rem' }}>
                        {`${formatHour(hour)}`}
                      </Typography>
                      <Divider orientation="vertical" flexItem style={{ marginRight: '1rem' }} />
                      <div>{renderAppointmentOrVago(hour, appointments)}</div>
                    </div>
                  </Paper>
                ))}
              </Grid>
            ))}
            {noAppointments && (
              <Grid item xs={12}>
                <Typography variant="h6" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                  {formatWeekdayDateMonthYear(selectedDate)}
                </Typography>
                {availableHours.map((hour) => (
                  <Paper elevation={3} style={{ padding: '1rem', marginBottom: '1rem' }} key={hour}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" style={{ marginRight: '1rem' }}>
                        {`${formatHour(hour)}`}
                      </Typography>
                      <Divider orientation="vertical" flexItem style={{ marginRight: '1rem' }} />
                      <div>
                        <Typography variant="body1" style={{ textAlign: 'center' }}>
                          Horário vago
                        </Typography>
                      </div>
                    </div>
                  </Paper>
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

export default Schedule;
