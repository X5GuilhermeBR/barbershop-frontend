/* eslint-disable no-plusplus */
import { Button, Container, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import { getBarbers, getSchedule, getServices } from '../../service/api';

function Schedule() {
  // Vetor de barbeiros
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');

  useEffect(() => {
    async function fetchBarbers() {
      const { data } = await getBarbers();
      setBarbers(data);
    }

    fetchBarbers();
  }, []);

  useEffect(() => {
    async function fetchServices() {
      const { data } = await getServices();
      setServices(data);
    }

    fetchServices();
  }, []);

  const fetchScheduleData = async () => {
    if (selectedBarber && selectedService && selectedDate) {
      try {
        const { data } = await getSchedule(selectedDate, selectedDate, selectedBarber.user_id);
        setSchedule(data);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    }
  };

  // UseEffect para chamar fetchScheduleData sempre que selectedBarber, selectedService ou selectedDate mudar
  useEffect(() => {
    fetchScheduleData();
  }, [selectedBarber, selectedService, selectedDate]);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getFutureDate = () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 45);
    const year = futureDate.getFullYear();
    const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
    const day = futureDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const generateAvailableHours = () => {
    const availableHours = [];
    for (let hour = 9; hour <= 18; hour++) {
      // Alterei para 18 para corresponder aos horários de 9 às 18h
      availableHours.push(`${hour}:00`);
    }
    return availableHours;
  };

  const getDisabledHours = () => {
    const availableHours = generateAvailableHours();
    const disabledHours = availableHours.map((hour) => {
      const isScheduled = schedule.some((appointment) => appointment.time === hour);
      return { time: hour, disabled: isScheduled };
    });
    return disabledHours;
  };
  const disabledHours = getDisabledHours();

  const handleSubmit = () => {
    console.log('Barbeiro selecionado:', selectedBarber);
    console.log('Serviço selecionado:', selectedService);
    console.log('Data selecionada:', selectedDate);
    console.log('Hora selecionada:', selectedHour);

    console.log('Schedule:', schedule); // Verifique se os dados de agendamento estão corretos
    console.log('Disabled hours:', disabledHours); // V
  };

  return (
    <Grid container direction="column" style={{ minHeight: '100vh' }}>
      <Grid item style={{ marginBottom: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container maxWidth="sm" textAlign="center">
          <Typography variant="h4" style={{ marginBottom: '2rem', marginTop: '4rem' }}>
            Agendamento
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Select
              label="Barbeiro"
              variant="outlined"
              fullWidth
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
            >
              <MenuItem value="">Selecione um barbeiro</MenuItem>
              {barbers.map((barber) => (
                <MenuItem key={barber.id} value={barber}>
                  {barber.barber_name}
                </MenuItem>
              ))}
            </Select>
            <Select
              label="Serviço"
              variant="outlined"
              fullWidth
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <MenuItem value="">Selecione um serviço</MenuItem>
              {services.map((service) => (
                <MenuItem key={service.id} value={service}>
                  {service.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Data"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: getCurrentDate(),
                max: getFutureDate(),
              }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <Select
              label="Hora"
              variant="outlined"
              fullWidth
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
            >
              <MenuItem value="">Selecione uma hora</MenuItem>
              {getDisabledHours().map((hour) => (
                <MenuItem key={hour.time} value={hour.time} disabled={hour.disabled}>
                  {hour.time}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Container>
      </Grid>
      <Grid item style={{ position: 'sticky', bottom: '5rem', zIndex: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          style={{ width: 'calc(100% - 2rem)', margin: '0 1rem' }}
          onClick={handleSubmit}
        >
          Agendar
        </Button>
      </Grid>
      <FooterNavigation />
    </Grid>
  );
}

export default Schedule;
