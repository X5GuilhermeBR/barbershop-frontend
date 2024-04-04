import AddIcon from '@mui/icons-material/Add';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Alert, AlertTitle, Container, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import SchedulingCard from '../../components/SchedulingCard/SchedulingCard';
import { useAuth } from '../../context/AuthContext';
import { checkScheduleById } from '../../service/api';
import colors from '../../utils/colors';
import {
  CustomButton,
  Divider,
  LocationContainer,
  LocationText,
  LocationTitle,
  ServiceCard,
  ServiceCardContainer,
  ServiceDescription,
  ServiceImage,
  ServiceName,
} from './HomeStyled';

function HomePage() {
  const { userInfo } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [hasScheduledAppointment, setHasScheduledAppointment] = useState(false);
  const navigate = useNavigate(); // Obtendo a função navigate

  useEffect(() => {
    async function fetchCheckScheduleById() {
      if (userInfo && userInfo.id) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const { data } = await checkScheduleById(formattedDate, '', userInfo.id);
        const sortedSchedule = data
          .filter((appointment) => appointment.status !== 'Cancelado')
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setSchedule(sortedSchedule);
        const hasAppointmentToday = sortedSchedule.some((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return (
            appointmentDate.toISOString().split('T')[0] === formattedDate &&
            appointment.status === 'Agendado'
          );
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

  const handleWhatsAppClick = () => {
    const phoneNumber = '5521972862906';
    const message = encodeURIComponent('mensagem');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.location.href = whatsappUrl;
  };

  const handleAgendarClick = () => {
    navigate('/novo-agendamento'); // Redirecionar para a rota '/agendar' ao clicar no botão
  };

  return (
    <>
      <Header icon={<ContentCutIcon />} title={`Bem-vindo, ${userInfo ? getFirstName() : ''}!`} />
      <Grid item style={{ marginBottom: '5rem', marginTop: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container>
          {hasScheduledAppointment && (
            <Alert sx={{ backgroundColor: colors.third, color: '#black' }}>
              <AlertTitle>Você tem um agendamento hoje!</AlertTitle>
              <strong>Chegue com 10 minutos de antecedência</strong>
            </Alert>
          )}
          <CustomButton
            variant="contained"
            backgroundColor={colors.secundary}
            startIcon={<AddIcon />}
            onClick={handleAgendarClick} // Adicionando o evento onClick
          >
            QUERO MARCAR UM HORÁRIO
          </CustomButton>
          <CustomButton
            variant="contained"
            backgroundColor={colors.fourth}
            startIcon={<WhatsAppIcon />}
            onClick={handleWhatsAppClick}
          >
            QUERO FALAR COM O FLOW
          </CustomButton>
          <Grid container spacing={1} marginTop={2}>
            {Array.isArray(schedule) &&
              schedule.map(
                (appointment) =>
                  appointment.status !== 'Cancelado' && (
                    <SchedulingCard key={appointment.id} appointment={appointment} />
                  )
              )}
          </Grid>
          <Divider />
          <LocationContainer>
            <LocationTitle>Principais Serviços</LocationTitle>
            <ServiceCardContainer>
              <ServiceCard>
                <ServiceImage src="caminho_para_a_imagem" alt="Nome do Serviço" />
                <ServiceName>CABELO</ServiceName>
                <ServiceDescription>Descrição breve do Serviço 1.</ServiceDescription>
              </ServiceCard>
              <ServiceCard>
                <ServiceImage src="caminho_para_a_imagem" alt="Nome do Serviço" />
                <ServiceName>BARBA</ServiceName>
                <ServiceDescription>Descrição breve do Serviço 2.</ServiceDescription>
              </ServiceCard>
              <ServiceCard>
                <ServiceImage src="caminho_para_a_imagem" alt="Nome do Serviço" />
                <ServiceName>PIGMENTAÇÃO</ServiceName>
                <ServiceDescription>Pigmentação</ServiceDescription>
              </ServiceCard>
              <ServiceCard>
                <ServiceImage src="caminho_para_a_imagem" alt="Nome do Serviço" />
                <ServiceName>DESCOLORAÇÃO</ServiceName>
                <ServiceDescription>Descrição breve do Serviço 4.</ServiceDescription>
              </ServiceCard>
            </ServiceCardContainer>
          </LocationContainer>
          <Divider />
          <LocationContainer>
            <LocationTitle>Onde Estamos</LocationTitle>
            <LocationText>
              R. Carolina Santos, 4 A<br />
              Lins de Vasconcelos - Rio de Janeiro
            </LocationText>
          </LocationContainer>
        </Container>
      </Grid>
      <FooterNavigation />
    </>
  );
}

export default HomePage;
