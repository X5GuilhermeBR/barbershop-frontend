import AddIcon from '@mui/icons-material/Add';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Alert, AlertTitle, Button, Container, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import SchedulingCard from '../../components/SchedulingCard/SchedulingCard';
import { useAuth } from '../../context/AuthContext';
import { checkScheduleById } from '../../service/api';
import colors from '../../utils/colors';

const CustomButton = styled(Button)`
  && {
    width: 100%;
    padding: 12px;
    background-color: ${(props) => props.backgroundColor || '#f6a700'};
    color: ${(props) => props.color || 'black'};
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    height: 55px;
    margin-top: 20px;
    font-weight: bold;
    -webkit-box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    text-transform: none;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      margin-right: 8px;
    }
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.basic};
  margin: 20px 0;
`;

const LocationContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const LocationTitle = styled.h2`
  margin-bottom: 8px;
  color: ${colors.third};
`;

const LocationText = styled.p`
  margin-bottom: 0;
  color: white;
  line-height: 22px;
`;

const ServiceCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ServiceCard = styled.div`
  width: calc(50% - 10px);
  background-color: ${colors.lightGrey};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);

  &:nth-child(2n) {
    margin-right: 0;
  }

  @media (max-width: 768px) {
    width: calc(50% - 20px);
    margin-right: 0;
  }
`;

const ServiceImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const ServiceName = styled.h3`
  font-size: 18px;
  margin-bottom: 8px;
`;

const ServiceDescription = styled.p`
  text-align: center;
`;

function HomePage() {
  const { userInfo } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [hasScheduledAppointment, setHasScheduledAppointment] = useState(false);

  useEffect(() => {
    async function fetchCheckScheduleById() {
      if (userInfo && userInfo.id) {
        const today = new Date(); // Obter a data de hoje
        const formattedDate = today.toISOString().split('T')[0]; // Formatar como "ano-mes-dia"
        const { data } = await checkScheduleById(formattedDate, '', userInfo.id); // Passar a data formatada para a requisição
        // Filtrar os agendamentos cancelados e ordenar da data mais próxima para a mais distante
        const sortedSchedule = data
          .filter((appointment) => appointment.status !== 'Cancelado')
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setSchedule(sortedSchedule);
        // Verificar se há um agendamento para hoje com o status "Agendado"
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

  return (
    <>
      <Header icon={<ContentCutIcon />} title={`Bem-vindo, ${userInfo ? getFirstName() : ''}!`} />
      <Grid item style={{ marginBottom: '4rem', marginTop: '2rem', flex: '1 0 auto', zIndex: 1 }}>
        <Container>
          {hasScheduledAppointment && ( // Exibir o Alert somente se houver um agendamento para hoje com o status "Agendado"
            <Alert sx={{ backgroundColor: '#f6a700', color: '#black' }}>
              <AlertTitle>Você tem um agendamento hoje!</AlertTitle>
              <strong>Chegue com 10 minutos de antecedência</strong>
            </Alert>
          )}
          <CustomButton
            variant="contained"
            backgroundColor={colors.secundary}
            startIcon={<AddIcon />}
          >
            QUERO MARCAR UM HORÁRIO
          </CustomButton>
          <CustomButton
            variant="contained"
            backgroundColor={colors.fourth}
            startIcon={<WhatsAppIcon />}
          >
            QUERO FALAR COM O FLOW
          </CustomButton>
          <Grid container spacing={1}>
            {Array.isArray(schedule) &&
              schedule.map(
                (appointment) =>
                  // Verifica se o agendamento não foi cancelado antes de criar o componente SchedulingCard
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
                <ServiceName>Cabelo</ServiceName>
                <ServiceDescription>Descrição breve do Serviço 1.</ServiceDescription>
              </ServiceCard>
              <ServiceCard>
                <ServiceImage src="caminho_para_a_imagem" alt="Nome do Serviço" />
                <ServiceName>Barba</ServiceName>
                <ServiceDescription>Descrição breve do Serviço 2.</ServiceDescription>
              </ServiceCard>
              <ServiceCard>
                <ServiceImage src="caminho_para_a_imagem" alt="Nome do Serviço" />
                <ServiceName>Pigmentação</ServiceName>
                <ServiceDescription>Pigmentação</ServiceDescription>
              </ServiceCard>
              <ServiceCard>
                <ServiceImage src="caminho_para_a_imagem" alt="Nome do Serviço" />
                <ServiceName>Descoloração</ServiceName>
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
