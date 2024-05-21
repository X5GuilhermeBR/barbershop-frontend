/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-array-index-key */
import HistoryIcon from '@mui/icons-material/History';
import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import * as XLSX from 'xlsx';
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

const Subtitle = styled(Typography)`
  && {
    color: ${colors.third};
    text-transform: uppercase;
    font-size: 14px;
    font-family: 'Bahnschrift', sans-serif;
  }
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

  // Função para exportar os dados
  const exportData = () => {
    // Cria um novo workbook
    const wb = XLSX.utils.book_new();

    // Dados do relatório geral
    const generalInfoData = [
      ['Descrição', 'Valor'],
      ['Total de Serviços', `R$ ${generalInfo.totalServices}`],
      ['Total de Produtos', `R$ ${generalInfo.totalProducts}`],
      ['Total Geral', `R$ ${generalInfo.totalServices + generalInfo.totalProducts}`],
    ];

    // Dados dos barbeiros
    const barberEarningsData = [
      ['Barbeiro', 'Arrecadação'],
      ...barberEarnings.map((barber) => [barber.name, `R$ ${barber.earnings}`]),
    ];

    // Dados das formas de pagamento
    const paymentMethodsData = [
      ['Forma de Pagamento', 'Total'],
      ...paymentMethods.map((method) => [method.method, `R$ ${method.total}`]),
    ];

    // Concatena todos os dados em uma única planilha com subtítulos
    const reportData = [
      ['Relatório Financeiro - Flow Barbershop '],
      [],
      ['Geral'],
      ...generalInfoData,
      [],
      ['Barbeiros'],
      ...barberEarningsData,
      [],
      ['Formas de Pagamento'],
      ...paymentMethodsData,
    ];

    // Cria a planilha a partir dos dados
    const reportSheet = XLSX.utils.aoa_to_sheet(reportData);
    XLSX.utils.book_append_sheet(wb, reportSheet, 'Relatório');

    // Converte o workbook para um arquivo e faz o download
    XLSX.writeFile(wb, 'Relatorio_Financeiro.xlsx');

    console.log('Dados exportados!');
  };

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
              <Subtitle variant="h6" gutterBottom>
                Geral
              </Subtitle>
              <Typography
                variant="body1"
                gutterBottom
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                Total de Serviços:
                <span>R${generalInfo.totalServices}</span>
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                Total de Produtos:
                <span>R${generalInfo.totalProducts}</span>
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                Total Geral:
                <span>R$ {generalInfo.totalServices + generalInfo.totalProducts}</span>
              </Typography>
              <Divider />
              <Subtitle variant="h6" gutterBottom>
                Barbeiros
              </Subtitle>
              {barberEarnings.map((barber, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  gutterBottom
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  {barber.name}:<span>R${barber.earnings}</span>
                </Typography>
              ))}
              <Divider />
              <Subtitle variant="h6" gutterBottom>
                Formas de Pagamento
              </Subtitle>
              {paymentMethods.map((method, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  gutterBottom
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  {method.method}:<span>R${method.total}</span>
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
