/* eslint-disable react/prop-types */
import ContentCutIcon from '@mui/icons-material/ContentCut';
import StarIcon from '@mui/icons-material/Star';
import Rating from '@mui/material/Rating';
import React, { useEffect, useState } from 'react';
import { getRatingByBarber } from '../../service/api';
import colors from '../../utils/colors';
import {
  BarberAvatar,
  BarberCardContainer,
  BarberDetails,
  BarberDetailsContent,
  BarberInfoContainer,
  LatestReviewsContainer,
  ReviewDetails,
  ReviewItem,
} from './BarberCardStyled';

function BarberCard({ profile }) {
  const [barberData, setBarberData] = useState(null);

  useEffect(() => {
    const fetchBarberRating = async () => {
      try {
        if (profile && profile.id) {
          const response = await getRatingByBarber(profile.id);
          setBarberData(response || {});
        }
      } catch (error) {
        console.error('Error fetching barber rating:', error);
      }
    };

    fetchBarberRating();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  return (
    <BarberCardContainer>
      <BarberInfoContainer>
        <BarberAvatar alt={profile.name} src={'https://i.postimg.cc/vTJ2Gm78/1.jpg' || ''} />
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
              <ReviewItem>
                <ReviewDetails>
                  <p>
                    {review.client.split(' ')[0] || '-'} -{' '}
                    <span>{formatDate(review.date) || '-'}</span>
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
