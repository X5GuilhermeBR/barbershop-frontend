import ContentCutIcon from '@mui/icons-material/ContentCut'
import { Alert, AlertTitle, Card, CardContent, Container, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation'
import PageHeader from '../../components/Header/Header'
import { useAuth } from '../../context/AuthContext'
import { checkScheduleById } from '../../service/api'

function HomePage() {
  const { userInfo } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [hasScheduledAppointment, setHasScheduledAppointment] = useState(false);
  
  useEffect(() => {
    async function fetchCheckScheduleById() {
      if (userInfo && userInfo.id) {
        const today = new Date(); // Obter a data de hoje
        const formattedDate = today.toISOString().split('T')[0]; // Formatar como "ano-mes-dia"
        const { data } = await checkScheduleById(userInfo.id, formattedDate); // Passar a data formatada para a requisição
        setSchedule(data);
        // Verificar se há um agendamento para hoje com o status "Agendado"
        const hasAppointmentToday = data.some(appointment => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate.toISOString().split('T')[0] === formattedDate && appointment.status === 'Agendado';
        });
        setHasScheduledAppointment(hasAppointmentToday);
      }
    }

    fetchCheckScheduleById();
  }, [userInfo]);

  const getFirstName = () => {
    if (!userInfo || !userInfo.name) return '';
    const fullName = userInfo.name;
    const firstName = fullName.split(' ')[0];
    return firstName;
  };

  return (
    <>
      <PageHeader icon={<ContentCutIcon />} title={`Bem-vindo, ${userInfo ? getFirstName() : ''}!`} />
      <Grid item style={{ marginBottom: '4rem', marginTop: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container>
          {hasScheduledAppointment && ( // Exibir o Alert somente se houver um agendamento para hoje com o status "Agendado"
            <Alert sx={{ backgroundColor: '#f6a700', color: '#black' }}>
              <AlertTitle>Você tem um agendamento hoje!</AlertTitle>
              {/* <strong>Com previsão de início ás 16:12h</strong> */}
            </Alert>
          )}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Próximos agendamentos:
          </Typography>
          <Grid container spacing={1}>
            {Array.isArray(schedule) &&
              schedule.map((appointment) => (
                <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" component="h2" gutterBottom>
                        Agendamento N#{appointment.id}:
                      </Typography>
                      <Typography variant="body1" component="p">
                        <strong>Data:</strong> {appointment.date}
                        <br />
                        <strong>Hora:</strong> {appointment.time}
                        <br />
                        <strong>Serviço:</strong> {appointment.service_name}
                        <br />
                        <strong>Barbeiro:</strong> {appointment.barber_name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>
      </Grid>
      <FooterNavigation />
    </>
  );
}

export default HomePage;
