/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import ErrorIcon from '@mui/icons-material/Error';
import HistoryIcon from '@mui/icons-material/History';
import { Container, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import SchedulingCard from '../../components/SchedulingCard/SchedulingCard';
import { useAuth } from '../../context/AuthContext';
import { checkScheduleById } from '../../service/api';
import colors from '../../utils/colors';
import { Divider, HistoryTitle, TitleNotSchedule } from './HistoryStyled';

const InfoText = styled.div`
  color: ${colors.third};
  font-size: 20px;
  padding-bottom: 8px;
`;

const StyledTextField = styled(TextField)`
  && {
    background-color: white;
    color: black;
  }
`;

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
        const currentDate = new Date();
        const filteredAppointments = data.filter(
          (appointment) => new Date(appointment.date) <= currentDate
        );
        const sortedAppointments = filteredAppointments.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setScheduledAppointments(sortedAppointments);
        setNoAppointments(sortedAppointments.length === 0);
      }
    }

    fetchScheduledAppointments();
  }, [userInfo, startDate, endDate]);

  const handleDateChange = (event) => {
    const selectedMonthYear = event.target.value;
    const [year, month] = selectedMonthYear.split('-');
    const firstDay = `${year}-${month}-01`;
    let currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');

    if (year === currentYear && month === currentMonth) {
      const today = currentDate.getDate();
      const endDate = `${year}-${month}-${today}`;
      setStartDate(firstDay);
      setEndDate(endDate);
    } else {
      currentDate = new Date(year, month, 0);
      const lastDayOfMonth = currentDate.getDate();
      const lastDay = `${year}-${month}-${lastDayOfMonth}`;
      setStartDate(firstDay);
      setEndDate(lastDay);
    }
  };

  const setInitialAndEndDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const firstDay = `${year}-${month}-01`;
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const lastDay = `${year}-${month}-${lastDayOfMonth}`;
    setStartDate(firstDay);

    const currentYear = String(currentDate.getFullYear());
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');

    if (year === currentYear && month === currentMonth) {
      const today = currentDate.getDate();
      const endDate = `${year}-${month}-${today}`;
      setEndDate(endDate);
    } else {
      setEndDate(lastDay);
    }
  };

  useEffect(() => {
    setInitialAndEndDate();
  }, []);

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
    const day = date.getDate() + 1;
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
          minHeight: 'calc(100vh - 200px)',
          flex: '1 0 auto',
        }}
      >
        <Container>
          <Grid container direction="column" style={{ marginBottom: '5rem', flex: '1 0 auto' }}>
            <Grid item xs={12}>
              <InfoText>Selecionar período: </InfoText>
              <StyledTextField
                id="date"
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

            {sortedGroupedAppointments.map(([dayOfWeek, appointments], index) => (
              <Grid item xs={12} key={dayOfWeek}>
                {index !== 0 && <Divider />}
                <HistoryTitle style={{ marginTop: '1rem' }}>
                  {formatWeekdayDateMonthYear(appointments[0].date)}
                </HistoryTitle>
                <Grid container spacing={2}>
                  {appointments
                    .filter((appointment) => appointment.status !== 'Agendado')
                    .map((appointment) => (
                      <Grid item key={appointment.id} xs={12}>
                        <SchedulingCard appointment={appointment} />
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            ))}

            {noAppointments && (
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                style={{ marginTop: '4rem', height: '100%' }}
              >
                <ErrorIcon style={{ fontSize: 190, color: `${colors.third}` }} />
                <TitleNotSchedule>
                  Você não possui histórico de atendimento neste mês.
                </TitleNotSchedule>
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
