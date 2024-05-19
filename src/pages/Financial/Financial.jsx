/* eslint-disable react/no-array-index-key */
import HistoryIcon from '@mui/icons-material/History';
import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import colors from '../../utils/colors';

const TitleText = styled.h2`
  color: ${colors.third};
  text-align: center;
`;

const InfoText = styled.div`
  font-size: 20px;
  color: ${colors.third};
  padding-bottom: 8px;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.basic};
  margin: 20px 0;
`;

const StyledTextField = styled(TextField)`
  && {
    background-color: white;
    color: black;
  }
`;

const StyledCard = styled(Card)`
  && {
    padding: 10px;
    margin-bottom: 20px; /* Adicionando espaçamento entre o card e o botão */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${colors.primary};
    color: white;
  }
`;

const ExportButton = styled(Button)`
  && {
    width: 100%; /* Definindo o botão para ocupar toda a largura */
    background-color: ${colors.red}; /* Alterando a cor do botão para vermelho */
  }
`;

function Financial() {
  // Função para exportar os dados
  const exportData = () => {
    // Lógica para exportar os dados
    console.log('Dados exportados!');
  };

  // Mock dos dados para o card de informações gerais
  const generalInfo = {
    totalServices: 1500, // Valor total de serviços
    totalProducts: 800, // Valor total de produtos
  };

  // Mock dos dados de arrecadação por barbeiro
  const barberEarnings = [
    { name: 'João', earnings: 600 },
    { name: 'Pedro', earnings: 800 },
    { name: 'Maria', earnings: 1000 },
  ];

  // Mock dos dados de formas de pagamento
  const paymentMethods = [
    { method: 'Pix', total: 1200 },
    { method: 'Cartão', total: 2000 },
    { method: 'Dinheiro', total: 500 },
  ];

  return (
    <>
      <Header icon={<HistoryIcon />} title="Financeiro" />
      <Grid container spacing={3} style={{ padding: '1rem', flexGrow: 1 }}>
        <Grid item xs={12}>
          <InfoText>Período: </InfoText>
          <StyledTextField
            id="date"
            type="month"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
          <Divider />
          <TitleText>Relatório Financeiro de </TitleText>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Geral
              </Typography>
              <Typography variant="body1" gutterBottom>
                Total de Serviços: R$ {generalInfo.totalServices}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Total de Produtos: R$ {generalInfo.totalProducts}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Total Geral: R$ {generalInfo.totalServices + generalInfo.totalProducts}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Barbeiros
              </Typography>
              {barberEarnings.map((barber, index) => (
                <Typography key={index} variant="body1" gutterBottom>
                  {barber.name}: R$ {barber.earnings}
                </Typography>
              ))}
              <Typography variant="h6" gutterBottom>
                Formas de Pagamento
              </Typography>
              {paymentMethods.map((method, index) => (
                <Typography key={index} variant="body1" gutterBottom>
                  {method.method}: R$ {method.total}
                </Typography>
              ))}
            </CardContent>
          </StyledCard>

          <ExportButton variant="contained" color="primary" onClick={exportData}>
            Exportar Dados
          </ExportButton>
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <FooterNavigation style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }} />
      </Grid>
    </>
  );
}

export default Financial;
