import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Alert, AlertTitle, Container, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarberCard from '../../components/BarberCard/BarberCard';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import SchedulingCard from '../../components/SchedulingCard/SchedulingCard';
import WalletCard from '../../components/WalletCard/WalletCard';
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
  const [isAppointmentWithinFourHours, setIsAppointmentWithinFourHours] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchScheduledAppointments() {
      if (userInfo && userInfo.id && userInfo.profile === 'barber') {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const { data } = await checkScheduleById(formattedDate, formattedDate, userInfo.id);
        console.log('data', data);
        setSchedule(data);
        setHasScheduledAppointment(data.length > 0);
      }
    }

    fetchScheduledAppointments();
  }, [userInfo]);

  useEffect(() => {
    async function fetchCheckScheduleById() {
      if (userInfo && userInfo.id) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const { data } = await checkScheduleById(formattedDate, '', userInfo.id);

        // Ordenar agendamentos por data
        const sortedSchedule = data.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Filtrar apenas o agendamento mais próximo à data atual
        const nearestAppointment = sortedSchedule.find((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return (
            appointmentDate.toISOString().split('T')[0] >= formattedDate &&
            appointment.status !== 'Finalizado' &&
            appointment.status !== 'Cancelado'
          );
        });

        if (userInfo.profile === 'client') {
          setSchedule(nearestAppointment ? [nearestAppointment] : []);
          setHasScheduledAppointment(!!nearestAppointment);
        }

        // Check if the nearest appointment is within 4 hours
        if (nearestAppointment) {
          const now = new Date();
          const appointmentDateTime = new Date(
            `${nearestAppointment.date}T${nearestAppointment.time}`
          );
          const timeDifference = (appointmentDateTime - now) / (1000 * 60 * 60);
          setIsAppointmentWithinFourHours(timeDifference <= 4);
        }
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
    const message = encodeURIComponent(
      `Olá, Tudo bem? Me chamo ${userInfo.name} e vim através do app Flow Barbershop e gostaria de tirar algumas dúvidas com vocês.`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.location.href = whatsappUrl;
  };

  const handleAgendarClick = () => {
    navigate('/novo-agendamento');
  };

  const handleSchecule = () => {
    navigate('/agenda');
  };

  return (
    <>
      <Header icon={<ContentCutIcon />} title={`Bem-vindo, ${userInfo ? getFirstName() : ''}!`} />
      <Grid item style={{ marginBottom: '5rem', marginTop: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        {userInfo?.profile === 'client' ? (
          <Container>
            {hasScheduledAppointment && isAppointmentWithinFourHours && (
              <Alert sx={{ backgroundColor: colors.third, color: '#black' }}>
                <AlertTitle>Você tem um agendamento hoje!</AlertTitle>
                <strong>Chegue com 10 minutos de antecedência</strong>
              </Alert>
            )}
            <CustomButton
              variant="contained"
              backgroundColor={colors.secundary}
              startIcon={<AddIcon />}
              onClick={handleAgendarClick}
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

            {Array.isArray(schedule) &&
              schedule.map((appointment) => (
                <React.Fragment key={appointment.id}>
                  <Divider />
                  <LocationContainer>
                    <LocationTitle>Próximo Atendimento</LocationTitle>
                  </LocationContainer>
                  <SchedulingCard appointment={appointment} />
                </React.Fragment>
              ))}

            <Divider />
            <LocationContainer>
              <LocationTitle>Principais Serviços</LocationTitle>

              <ServiceCardContainer>
                <ServiceCard>
                  <ServiceImage src="https://i.postimg.cc/nLqDWhrY/cabelo.jpg" alt="Cabelo" />
                  <ServiceName>CABELO</ServiceName>
                  <ServiceDescription>Incrível e atual</ServiceDescription>
                </ServiceCard>
                <ServiceCard>
                  <ServiceImage src="https://i.postimg.cc/P5RyHJdg/barba.jpg" alt="Barba" />
                  <ServiceName>BARBA</ServiceName>
                  <ServiceDescription>Elegante e charmosa</ServiceDescription>
                </ServiceCard>
                <ServiceCard>
                  <ServiceImage
                    src="https://i.postimg.cc/y8cx1rK7/pigmentacao.jpg"
                    alt="Pigmentação"
                  />
                  <ServiceName>PIGMENTAÇÃO</ServiceName>
                  <ServiceDescription>Forma eficaz</ServiceDescription>
                </ServiceCard>
                <ServiceCard>
                  <ServiceImage src="https://i.postimg.cc/sXNs9pzn/platinado.jpg" alt="PLATINADO" />
                  <ServiceName>PLATINADO</ServiceName>
                  <ServiceDescription>Estilo sempre</ServiceDescription>
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
        ) : (
          <Container>
            <CustomButton
              variant="contained"
              backgroundColor={colors.secundary}
              startIcon={<CalendarMonthIcon />}
              onClick={handleSchecule}
            >
              CONFERIR MINHA AGENDA
            </CustomButton>
            <Divider />
            <LocationContainer>
              <LocationTitle>Minha Carteira</LocationTitle>
              {userInfo && <WalletCard schedule={schedule} />}
            </LocationContainer>
            <Divider />
            <LocationContainer>
              <LocationTitle>Minhas Avaliações</LocationTitle>
              {userInfo && <BarberCard profile={userInfo} />}
            </LocationContainer>
          </Container>
        )}
      </Grid>
      <FooterNavigation />
    </>
  );
}

export default HomePage;
