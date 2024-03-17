import HistoryIcon from '@mui/icons-material/History'
import { Container, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation'
import Header from '../../components/Header/Header'
import SchedulingCard from '../../components/SchedulingCard/SchedulingCard'

import { useAuth } from '../../context/AuthContext'
import { checkScheduleById } from '../../service/api'

function History() {
  const { userInfo } = useAuth();
  const [scheduledAppointments, setScheduledAppointments] = useState([]);

  useEffect(() => {
    async function fetchScheduledAppointments() {
      if (userInfo && userInfo.id) {
        const today = new Date(); 
        const formattedDate = today.toISOString().split('T')[0]; 
        const { data } = await checkScheduleById(undefined, formattedDate, userInfo.id); 
        setScheduledAppointments(data);
      }
    }
  
    fetchScheduledAppointments();
  }, [userInfo]);

  return (
    <>
      <Header icon={<HistoryIcon />} title="Meu Histórico" />
      <Grid item style={{ marginBottom: '4rem', marginTop: '1rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container>
          <Grid container direction="column" style={{ marginBottom: '5rem', flex: '1 0 auto', zIndex: 1 }}>
            <Grid container spacing={2} justifyContent="center">
              {scheduledAppointments.map(appointment => (
                <SchedulingCard key={appointment.id} appointment={appointment} />
              ))}
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <FooterNavigation style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }} />
    </>
  );
}

export default History;
