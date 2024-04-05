/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import ContentCutIcon from '@mui/icons-material/ContentCut';
import StarIcon from '@mui/icons-material/Star';
import { Avatar } from '@mui/material';
import Rating from '@mui/material/Rating';
import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';

// Componente styled para o card do barbeiro
const BarberCardContainer = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: ${colors.primary};
`;

const BarberInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const BarberAvatar = styled(Avatar)`
  margin-right: 10px;
  width: 86px;
  height: 86px;
  border: 2px solid white; /* Adicionando contorno branco */
`;

const BarberDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  h2 {
    text-align: left;
    margin: 0px;
    color: ${colors.third};
    font-size: 20px;
  }

  div {
    margin-top: 3px;
    display: flex;
  }

  div + div {
    margin-left: 30px;
  }
`;

const BarberDetailsContent = styled.div`
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

const LatestReviewsContainer = styled.div`
  margin-top: 20px;

  h2 {
    text-align: left;
    font-size: 14px;
    color: ${colors.third};
  }
`;

const ReviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ReviewDetails = styled.div`
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

function BarberCard({ profile }) {
  // Dados fictícios do barbeiro e suas avaliações
  const barber = {
    name: 'MURILO CALDEIRA',
    avatar:
      'https://play-lh.googleusercontent.com/hnWtJllVHkP08SfpHQFI4COBX6oXN26JX6JuiS5nrERD6n-NgOaZ4oZeealVbv9ZAuqxhaG4RAfB_P4E54U=s1280-w1280-h720',
    rating: 4.98,
    totalCuts: 120,
    latestReviews: [
      { client: 'Maria', date: '04/04', rating: 4 },
      { client: 'José', date: '04/04', rating: 5 },
      { client: 'Ana', date: '04/04', rating: 4.5 },
      { client: 'Pedro', date: '04/04', rating: 3.5 },
      { client: 'Carla', date: '04/04', rating: 4 },
    ],
  };

  return (
    <BarberCardContainer>
      <BarberInfoContainer>
        <BarberAvatar alt={barber.name} src={barber.avatar} />
        <BarberDetails>
          <h2>{profile.name.toUpperCase()}</h2>
          <div>
            <BarberDetailsContent>
              <p>MÉDIA</p>
              <p>
                {barber.rating}
                <StarIcon sx={{ marginLeft: '5px' }} />
              </p>
            </BarberDetailsContent>
            <BarberDetailsContent>
              <p>CORTES</p>
              <p>
                {barber.totalCuts}
                <ContentCutIcon sx={{ marginLeft: '5px' }} />
              </p>
            </BarberDetailsContent>
          </div>
        </BarberDetails>
      </BarberInfoContainer>
      <LatestReviewsContainer>
        <h2>ÚLTIMAS AVALIAÇÕES</h2>
        {barber.latestReviews.map((review, index) => (
          <ReviewItem>
            <ReviewDetails>
              <p>
                {review.client} - <span> {review.date}</span>
              </p>
            </ReviewDetails>
            <Rating name={`rating-${index}`} value={review.rating} precision={0.5} readOnly />
          </ReviewItem>
        ))}
      </LatestReviewsContainer>
    </BarberCardContainer>
  );
}

export default BarberCard;
