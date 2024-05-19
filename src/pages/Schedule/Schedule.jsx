/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-param-reassign */
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Container, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importe useHistory
import styled from 'styled-components';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { useAuth } from '../../context/AuthContext';
import { checkScheduleById } from '../../service/api';
import colors from '../../utils/colors';
import {
  ActionIcons,
  AppointmentContent,
  HourText,
  SchedulingCard,
  SchedulingCardContent,
  StyledChip,
  StyledDivider,
  Title,
} from './ScheduleStyled';

function Schedule() {
  const StyledTextField = styled(TextField)`
    background-color: white; // Define o fundo como branco
    color: black; // Define a cor do texto como preto
  `;

  const InfoText = styled.div`
    color: ${colors.third};
    font-size: 20px;
    margin-bottom: 0.5rem;
  `;

  const { userInfo } = useAuth();
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [noAppointments, setNoAppointments] = useState(false);
  const navigate = useNavigate(); // Obtenha a instância de useHistory

  useEffect(() => {
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().split('T')[0];
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
    const daysOfWeek = [
      'Domingo',
      'Segunda-Feira',
      'Terça-Feira',
      'Quarta-Feira',
      'Quinta-Feira',
      'Sexta-Feira',
      'Sábado',
    ];
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    const dayOfWeek = daysOfWeek[date.getDay()];
    return `Atendimentos Previstos para ${dayOfWeek}`;
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
      (appoint) =>
        parseInt(appoint.time.split(':')[0], 10) === hour && appoint.status !== 'Cancelado'
    );

    if (hour === 12) {
      return <h2>Intervalo para Almoço</h2>;
    }

    if (appointment) {
      const formattedPrice = `R$${appointment.service_price.replace('.', ',')}`;

      const fullName = appointment.client_name.split(' ');
      const firstName = fullName[0];
      const lastName = fullName[fullName.length - 1];
      const truncatedName = `${firstName} ${lastName}`;

      return (
        <>
          <h2>Agendamento N#{appointment.id}</h2>
          <p>
            <strong>Cliente:</strong> {truncatedName}
            <br />
            <strong>Valor:</strong> {formattedPrice}
            <br />
          </p>
          <StyledChip label={appointment.status.toUpperCase()} status={appointment.status} />
        </>
      );
    }

    return <h2>Horário vago</h2>;
  };

  const handleAddAppointment = () => {
    navigate('/novo-agendamento'); // Navegue para a rota '/novo-agendamento' quando o ícone de adição for clicado
  };

  const handleEditAppointment = (appointment) => {
    if (appointment.status === 'Agendado') {
      navigate(`/novo-agendamento?scheduleId=${appointment.id}`);
    }
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
          <Grid container direction="column" style={{ flex: '1 0 auto' }}>
            <Grid item xs={12}>
              <InfoText>Selecione a Data: </InfoText>
              <StyledTextField
                id="date"
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
                <Title>{formatWeekdayDateMonthYear(date)}</Title>
                {availableHours.map((hour) => (
                  <SchedulingCard elevation={3} key={hour}>
                    <SchedulingCardContent>
                      <HourText variant="body1">{`${formatHour(hour)}`}</HourText>
                      <StyledDivider orientation="vertical" flexItem />
                      <AppointmentContent>
                        {renderAppointmentOrVago(hour, appointments)}
                      </AppointmentContent>
                      <ActionIcons>
                        {appointments.find(
                          (appoint) => parseInt(appoint.time.split(':')[0], 10) === hour
                        ) ? (
                          <>
                            {appointments.find(
                              (appoint) =>
                                parseInt(appoint.time.split(':')[0], 10) === hour &&
                                appoint.status !== 'Cancelado'
                            ) ? (
                              <>
                                <EditIcon
                                  fontSize="small"
                                  style={{ cursor: 'pointer', color: 'white' }}
                                  onClick={() =>
                                    handleEditAppointment(
                                      appointments.find(
                                        (appoint) =>
                                          parseInt(appoint.time.split(':')[0], 10) === hour
                                      )
                                    )
                                  }
                                />
                                <KeyboardArrowRightIcon
                                  fontSize="small"
                                  style={{ cursor: 'pointer', color: 'white' }}
                                  onClick={() =>
                                    handleEditAppointment(
                                      hour,
                                      appointments.find(
                                        (appoint) =>
                                          parseInt(appoint.time.split(':')[0], 10) === hour
                                      )
                                    )
                                  }
                                />
                              </>
                            ) : (
                              <AddIcon
                                fontSize="small"
                                style={{ cursor: 'pointer', color: 'white' }}
                                onClick={() => handleAddAppointment(hour)}
                              />
                            )}
                          </>
                        ) : (
                          <AddIcon
                            fontSize="small"
                            style={{ cursor: 'pointer', color: 'white' }}
                            onClick={() => handleAddAppointment(hour)}
                          />
                        )}
                      </ActionIcons>
                    </SchedulingCardContent>
                  </SchedulingCard>
                ))}
              </Grid>
            ))}
            {noAppointments && (
              <Grid item xs={12}>
                <Title>Atendimentos previstos de {formatWeekdayDateMonthYear(selectedDate)}</Title>
                {availableHours.map((hour) => (
                  <SchedulingCard elevation={3} key={hour}>
                    <SchedulingCardContent>
                      <HourText variant="body1">{`${formatHour(hour)}`}</HourText>
                      <StyledDivider orientation="vertical" flexItem />
                      <AppointmentContent>
                        <h2>Horário vago</h2>
                      </AppointmentContent>
                      <ActionIcons>
                        <AddIcon
                          fontSize="small"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleAddAppointment(hour)}
                        />
                      </ActionIcons>
                    </SchedulingCardContent>
                  </SchedulingCard>
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
