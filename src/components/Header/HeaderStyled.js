
import styled from 'styled-components';

const backgroundImageUrl = 'https://i.postimg.cc/9zH7QZSN/header.png';

export const StyledHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column; /* Adicionando centralização vertical */
  font-weight: bold;
  font-size: 1.2rem;
  padding-top: 12px;
  padding-bottom: 12px;
  background-image: linear-gradient(to bottom, rgba(20, 29, 34, 0) 0%, #141D22 100%), url(${backgroundImageUrl});
  background-size: cover;
  height: 100px;
  box-shadow: none;
  border: none;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 24px;
`;

export const Clock = styled.div`
  font-size: 14px;
`;