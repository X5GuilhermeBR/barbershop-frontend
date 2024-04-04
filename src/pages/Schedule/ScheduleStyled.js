import { Chip, Divider, Paper, Typography } from '@mui/material'
import styled from 'styled-components'
import colors from '../../utils/colors';

export const Title = styled.h2`
  margin-bottom: 30px;
    text-align: center;
    color: ${colors.third};
`;


export const SchedulingCard = styled(Paper)`
  background-color: ${colors.primary};
  border-radius: 8px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
`;

// Styled component for the inner container of the SchedulingCard
export const SchedulingCardContent = styled.div`
  display: flex;
  align-items: center;
`;

// Styled component for the hour text
export const HourText = styled(Typography)`
  margin-right: 1rem;
  color: white;
`;

// Styled component for the divider
export const StyledDivider = styled(Divider)`
  height: 100%;
  width: 1px;
  background-color: white;
  margin: 0 20px;
`;

// Styled component for the appointment content
export const AppointmentContent = styled.div`
  flex: 1;
  color: white;
  line-height: 28px;

  p {
    margin-top: 2px;
  }

  h2 {
    font-size: 22px;
    margin: 0px;
    text-align: left;
  }
`;

export const ActionIcons = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledChip = styled(Chip)`
  && {
    padding-top: 2px;
    font-size: 10px;
    background-color: ${({ status }) => {
      switch (status) {
        case 'Agendado':
          return colors.third;
        case 'Em Progresso':
          return colors.third;
        case 'Finalizado':
          return colors.third;
        case 'Cancelado':
          return colors.third;
        default:
          return colors.third;
      }
    }};
    color: ${colors.primary};
    font-weight: bold;
  }
`;