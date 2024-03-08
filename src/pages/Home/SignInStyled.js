import styled from 'styled-components';
import background from '../../assets/background.jpg';

const CenteredDivStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Altura total da viewport */
  background-image: url(${background});
  background-size: cover; /* Ajusta o tamanho da imagem para cobrir o container */
  background-position: center; /* Centraliza a imagem no container */

  div {
    width: 70%;
    max-width: 500px; /* Largura máxima para garantir que o conteúdo não fique muito largo em telas grandes */
  }

  button {
    margin-bottom: 10px;
    width: 100%;
  }

  @media (max-width: 768px) {
    div {
      width: 80%;
    }
  }

  @media (max-width: 480px) {
    div {
      width: 90%;
    }
  }
`;

export default CenteredDivStyled;
