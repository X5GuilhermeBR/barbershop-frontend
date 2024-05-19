/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import HistoryIcon from '@mui/icons-material/History';
import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import styled from 'styled-components';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import colors from '../../utils/colors';

const InfoText = styled.div`
  color: ${colors.third};
  font-size: 20px;
  padding-bottom: 8px;
`;

const StyledTextField = styled(TextField)`
  && {
    background-color: white;
    color: black;
  }
`;

function Financial() {
  // Estado para armazenar o mês e ano selecionados no filtro
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

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
          <InfoText>Relatório Financeiro de: </InfoText>
          <Card>
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
          </Card>

          <Button variant="contained" color="primary" onClick={exportData}>
            Exportar Dados
          </Button>
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <FooterNavigation style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }} />
      </Grid>
    </>
  );
}

export default Financial;
