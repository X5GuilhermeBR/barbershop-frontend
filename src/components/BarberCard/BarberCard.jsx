/* eslint-disable react/no-array-index-key */
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

const getRandomName = () => {
  const names = [
    'Luke Skywalker',
    'Darth Vader',
    'Indiana Jones',
    'James Bond',
    'Forrest Gump',
    'Rocky Balboa',
    'Tony Montana',
    'Vito Corleone',
    'Michael Corleone',
    'Ellen Ripley',
    'Harry Potter',
    'Hermione Granger',
    'Ron Weasley',
    'Frodo Baggins',
    'Gollum',
    'Dorothy Gale',
    'The Terminator',
    'Marty McFly',
    'The Joker',
    'Batman',
    'Superman',
    'Spider-Man',
    'Wolverine',
    'Hannibal Lecter',
    'Jack Sparrow',
    'Neo',
    'Trinity',
    'Morpheus',
    "Scarlett O'Hara",
    'Rhett Butler',
    'Norman Bates',
    'Mary Poppins',
    'Mulan',
    'Simba',
    'Buzz Lightyear',
    'Woody',
    'Yoda',
    'Gandalf',
    'Legolas',
    'Aragorn',
    'Princess Leia',
    'Han Solo',
    'Chewbacca',
    'R2-D2',
    'C-3PO',
    'E.T.',
    'Atticus Finch',
    'Clarice Starling',
    'Don Vito Corleone',
    'Blondie',
    'The Dude',
    'Tyler Durden',
  ];

  return names[Math.floor(Math.random() * names.length)];
};

function BarberCard({ profile }) {
  const [barberData, setBarberData] = useState(null);
  const [reviewsWithRandomNames, setReviewsWithRandomNames] = useState([]);

  useEffect(() => {
    const fetchBarberRating = async () => {
      try {
        if (profile && profile.id) {
          const response = await getRatingByBarber(profile.id);
          setBarberData(response || {});

          if (response?.last_appointments) {
            const reviewsWithNames = response.last_appointments.map((review) => ({
              ...review,
              randomName: getRandomName(),
            }));
            setReviewsWithRandomNames(reviewsWithNames);
          }
        }
      } catch (error) {
        console.error('Error fetching barber rating:', error);
      }
    };

    fetchBarberRating();
  }, [profile]);

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
        {reviewsWithRandomNames.length > 0 ? (
          reviewsWithRandomNames.map((review, index) => (
            <ReviewItem key={index}>
              <ReviewDetails>
                <p>
                  {review.randomName} - <span>{formatDate(review.date) || '-'}</span>
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
        )}
      </LatestReviewsContainer>
    </BarberCardContainer>
  );
}

export default BarberCard;
