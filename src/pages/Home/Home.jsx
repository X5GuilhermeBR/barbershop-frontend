import ContentCutIcon from '@mui/icons-material/ContentCut'
import { Alert, AlertTitle, Card, CardContent, Container, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation'
import PageHeader from '../../components/PageHeader/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { checkScheduleById } from '../../service/api'

function HomePage() {
  const { userInfo } = useAuth();
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    async function fetchCheckScheduleById() {
      if (userInfo && userInfo.id) {
        const { data } = await checkScheduleById(userInfo.id);
        setSchedule(data);
      }
    }

    fetchCheckScheduleById();
  }, [userInfo]);

  const getFirstName = () => {
    if (!userInfo || !userInfo.name) return ''; // Verifica se userInfo e userInfo.name estão definidos
    const fullName = userInfo.name;
    const firstName = fullName.split(' ')[0];
    return firstName;
  };

  return (
    <>
    <PageHeader icon={<ContentCutIcon/>} title={`Bem-vindo, ${userInfo ? getFirstName() : ''}!`}/>
      <Container sx={{ mt: 4, mb: 10 }}>
        <Alert sx={{ backgroundColor: '#f6a700', color: '#black' }}>
          <AlertTitle>Você tem um agendamento hoje!</AlertTitle>
          <strong>Com previsão de início ás 16:12h</strong>
        </Alert>
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
      <FooterNavigation />
    </>
  );
}

export default HomePage;
