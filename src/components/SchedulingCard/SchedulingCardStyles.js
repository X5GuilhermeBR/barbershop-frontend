import { Card, CardActions, CardContent, Grid, Chip } from '@mui/material';
import styled from 'styled-components';
import colors from '../../utils/colors';

export const StyledGridItem = styled(Grid)`
  margin-top: 0px;
`;

export const StyledCard = styled(Card)`
  && {
    background-color: ${colors.primary};
    border-radius: 15px;
    -webkit-box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    width: 100%;
    margin: auto; /* Centralize o card horizontalmente */
  }
`;

export const StyledCardContent = styled(CardContent)`
  && {
    padding: 12px;
    color: ${colors.primaryText};
  }

  h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    line-height: 28px;
    margin-bottom: 10px;
  }
`;

export const RatingContainer = styled.div`
  background-color: ${colors.secondary};
  padding: 10px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
`;

export const StyledCardActions = styled(CardActions)`
  && {
    padding: 4px 15px 4px 15px;
    justify-content: space-between;
    background-color: ${colors.secundary};
    height: 40px;
  }

  p {
    font-size: 16px;
    line-height: 28px;
    color: ${colors.primary};
    font-weight: bold;
  }
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
