import styled from 'styled-components'
import { Avatar } from '@mui/material'
import colors from '../../utils/colors'

export const BarberCardContainer = styled.div`
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: ${colors.primary};
`;

export const BarberInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

export const BarberAvatar = styled(Avatar)`
  margin-right: 20px;
  width: 86px !important;
  height: 86px !important;
  border: 2px solid white; /* Adicionando contorno branco */
`;

export const BarberDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  h2 {
    text-align: left;
    margin: 0px;
    color: ${colors.third};
    font-size: 18px;
  }

  div {
    margin-top: 3px;
    display: flex;
  }

  div + div {
    margin-left: 30px;
  }
`;

export const BarberDetailsContent = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: baseline;
  align-content: baseline;

  p {
    margin: 0;
    font-size: 10px;
  }

  p + p {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: end;
  }
`;

export const LatestReviewsContainer = styled.div`
  margin-top: 20px;

  h2 {
    text-align: left;
    font-size: 14px;
    color: ${colors.third};
  }
`;

export const ReviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

export const ReviewDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  align-content: baseline;

  p {
    font-size: 16px;
    margin: 0px;
    font-weight: bold;

    span {
      font-weight: lighter;
      margin: 0px;
      font-size: 12px;
    }
  }
`;