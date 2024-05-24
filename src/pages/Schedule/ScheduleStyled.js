import { Chip, Divider, Paper, Typography } from '@mui/material'
import styled from 'styled-components'
import colors from '../../utils/colors';

export const Title = styled.h2`
  margin-bottom: 20px;
    text-align: center;
    color: ${colors.third};
`;

export const SchedulingCard = styled(Paper)`
  background-color: ${colors.primary} !important;
  border-radius: 8px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
`;

// Styled component for the inner container of the SchedulingCard
export const SchedulingCardContent = styled.div`
  display: flex;
  align-items: center; /* Centraliza verticalmente */
  justify-content: center; /* Centraliza horizontalmente */
`;
// Styled component for the hour text
export const HourText = styled(Typography)`
  color: white;
  padding-right: 15px;
`

// Styled component for the divider
export const StyledDivider = styled(Divider)`
  width: 1px;
  background-color: white;
  margin: 0 20px;
`;

// Styled component for the appointment content
export const AppointmentContent = styled.div`
  flex: 1;
  color: white;
  line-height: 28px;
  margin-left: 15px;

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
    font-size: 10px;
    margin-right: 5px;
    background-color: ${({ type }) => {
      switch (type) {
        case 'Marcado':
          return '#94c7b6';
        case 'Encaixe':
          return '#de6262';
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
    height: 20px;

    span {
      padding: 3px 6px 0px 6px;
      
    }
  }
`;