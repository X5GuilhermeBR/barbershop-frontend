/* eslint-disable no-plusplus */
import { Button, Container, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import SelectComponent from '../../components/SelectComponent/SelectComponent';
import { useAuth } from '../../context/AuthContext';
import { createSchedule, getBarbers, getSchedule, getServices } from '../../service/api';
import { getCurrentDate, getDisabledHours, getFutureDate } from '../../utils/generalFunctions';

function Schedule() {
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const { userInfo } = useAuth();
  const [isFormValid, setIsFormValid] = useState(false);

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

  useEffect(() => {
    fetchScheduleData();
  }, [selectedBarber, selectedService, selectedDate]);

  useEffect(() => {
    setIsFormValid(selectedBarber && selectedService && selectedDate && selectedHour);
  }, [selectedBarber, selectedService, selectedDate, selectedHour]);

  const createScheduleObject = () => ({
    id_user_client: userInfo.id,
    id_user_barber: selectedBarber.user_id,
    type: 'Agendado',
    date: selectedDate,
    time: selectedHour,
    id_service: selectedService.id,
    status: 'Agendado',
  });

  const handleSubmit = async () => {
    if (!isFormValid) {
      return;
    }

    const scheduleData = createScheduleObject();
    try {
      createSchedule(scheduleData).then(() => {
        setSelectedBarber('');
        setSelectedService('');
        setSelectedDate('');
        setSelectedHour('');
        setSchedule([]);
      });
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    }
  };

  return (
    <Grid container direction="column">
      <Grid item style={{ marginBottom: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container maxWidth="sm" textAlign="center">
          <Typography variant="h4" style={{ marginBottom: '2rem', marginTop: '4rem' }}>
            Agendamento
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SelectComponent
              label="Barbeiro"
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              items={barbers}
            />
            <SelectComponent
              label="Serviço"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              items={services}
            />
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
              {getDisabledHours(schedule).map((hour) => (
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
          disabled={!isFormValid}
        >
          Agendar
        </Button>
      </Grid>
      <FooterNavigation />
    </Grid>
  );
}

export default Schedule;
