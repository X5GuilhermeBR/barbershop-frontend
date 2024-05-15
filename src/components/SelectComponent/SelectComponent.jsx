/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { MenuItem, Select } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';

// Estiliza o componente Select com styled-components
const StyledSelect = styled(Select)`
  background-color: white; // Define o fundo como branco
  color: black; // Define a cor do texto como preto
  border: 0px; // Define a borda como branca
`;

// Estiliza o componente MenuItem com styled-components
const StyledMenuItem = styled(MenuItem)`
  color: black; // Define a cor do texto como preto
`;

// Estiliza o texto informativo com styled-components
const InfoText = styled.div`
  color: ${colors.third};
  font-size: 20px;
`;

function SelectComponent({ label, value, onChange, items }) {
  return (
    <>
      <InfoText>{label}:</InfoText>
      <StyledSelect variant="outlined" fullWidth value={value} onChange={onChange} displayEmpty>
        <StyledMenuItem value="" disabled>
          {`Selecione um ${label.toLowerCase()}`}
        </StyledMenuItem>
        {items &&
          items.map((item) => {
            const { client_name, barber_name, ...rest } = item;
            const itemName = client_name || barber_name || rest.name;

            return (
              <StyledMenuItem key={item.id} value={item}>
                {itemName}
              </StyledMenuItem>
            );
          })}
      </StyledSelect>
    </>
  );
}

export default SelectComponent;
