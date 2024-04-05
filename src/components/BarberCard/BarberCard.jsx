/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import ContentCutIcon from '@mui/icons-material/ContentCut';
import StarIcon from '@mui/icons-material/Star';
import { Avatar } from '@mui/material';
import Rating from '@mui/material/Rating';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getRatingByBarber } from '../../service/api';
import colors from '../../utils/colors';

// Componente styled para o card do barbeiro
const BarberCardContainer = styled.div`
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
  margin-right: 20px;
  width: 86px !important;
  height: 86px !important;
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
  const [barberData, setBarberData] = useState(null);

  useEffect(() => {
    const fetchBarberRating = async () => {
      try {
        if (profile && profile.id) {
          const response = await getRatingByBarber(profile.id);
          console.log(response);
          setBarberData(response || {}); // Se response for null ou undefined, define um objeto vazio
        }
      } catch (error) {
        console.error('Error fetching barber rating:', error);
      }
    };

    fetchBarberRating();
  }, []);

  // Renderiza o componente com base nos dados do barbeiro recebidos da requisição
  return (
    <BarberCardContainer>
      <BarberInfoContainer>
        <BarberAvatar alt={profile.name} src={barberData?.avatar || ''} />
        <BarberDetails>
          <h2>{profile.name?.toUpperCase() || '-'}</h2>
          <div>
            <BarberDetailsContent>
              <p>MÉDIA</p>
              <p>
                {barberData?.average_rating || '-'}
                <StarIcon sx={{ marginLeft: '5px', color: `${colors.second}` }} />
              </p>
            </BarberDetailsContent>
            <BarberDetailsContent>
              <p>CORTES</p>
              <p>
                {barberData?.total_appointments || '-'}
                <ContentCutIcon sx={{ marginLeft: '5px', color: `${colors.second}` }} />
              </p>
            </BarberDetailsContent>
          </div>
        </BarberDetails>
      </BarberInfoContainer>
      <LatestReviewsContainer>
        <h2>ÚLTIMAS AVALIAÇÕES</h2>
        {barberData &&
          (barberData?.last_appointments?.length > 0 ? (
            barberData?.last_appointments.map((review, index) => (
              <ReviewItem key={index}>
                <ReviewDetails>
                  <p>
                    {review.client.split(' ')[0] || '-'} - <span>{review.date || '-'}</span>
                  </p>
                </ReviewDetails>
                <Rating
                  name={`rating-${index}`}
                  value={review.rating || 0}
                  precision={0.5}
                  readOnly
                />
              </ReviewItem>
            ))
          ) : (
            <p>Nenhuma avaliação encontrada</p>
          ))}
      </LatestReviewsContainer>
    </BarberCardContainer>
  );
}

export default BarberCard;
