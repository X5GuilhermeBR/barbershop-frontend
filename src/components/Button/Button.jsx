/* eslint-disable react/prop-types */
import React from 'react';
import { StyledButton } from './ButtonStyled';

// Componente de botão
function Button({ children, onClick, backgroundColor, width, borderColor, color }) {
  return (
    <StyledButton
      onClick={onClick}
      color={color}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      width={width}
    >
      {children}
    </StyledButton>
  );
}

export default Button;
