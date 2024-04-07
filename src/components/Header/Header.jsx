/* eslint-disable react/prop-types */
import React from 'react';
import { Clock, StyledHeader, Title } from './HeaderStyled';

function Header({ title }) {
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString('pt-BR', { weekday: 'long' })}, ${currentDate.getHours()}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

  return (
    <StyledHeader>
      <Title>{title}</Title>
      <Clock>{formattedDate}</Clock>
    </StyledHeader>
  );
}

export default Header;
