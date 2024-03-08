/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const StyledButton = styled.button`
background-color: ${props => props.backgroundColor || 'transparent'};
color: ${props => props.color || 'black'};
padding: 10px 20px;
border: 1px solid; 
border-radius: 5px;
border-color: ${props => props.borderColor || 'transparent'};
cursor: pointer;
font-size: 20px;
height: 50px;
width: ${props => props.width || 'auto'}; // Definindo a largura do botão

&:hover {
  background-color: ${props => props.hoverBackgroundColor || '#dddddd'};
  color: ${props => props.hoverColor || 'black'};
}
`;