/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-array-index-key */
import HistoryIcon from '@mui/icons-material/History';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useState } from 'react';
import styled from 'styled-components';
import * as XLSX from 'xlsx';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { getScheduleReport } from '../../service/api';
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

const ExportOptionsButton = styled(Button)`
  && {
    margin: 0 5px; /* Adicionando espaçamento entre os botões */
    background-color: ${colors.red}; /* Alterando a cor do botão para vermelho */
  }
`;

function Financial() {
  const [open, setOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReportData = async () => {
    try {
      const data = await getScheduleReport(startDate, endDate);
      setReportData(data);
    } catch (error) {
      console.error('Erro ao buscar dados do relatório:', error);
    }
  };

  const exportDataXLSX = () => {
    const wb = XLSX.utils.book_new();

    const generalInfoData = [
      ['Descrição', 'Valor'],
      ['Total de Serviços', `R$ ${reportData.totalServicesAmount}`],
      ['Total de Produtos', `R$ ${reportData.totalProductsAmount}`],
      ['Total Geral', `R$ ${reportData.totalAmount}`],
    ];

    const paymentMethodsData = [
      ['Forma de Pagamento', 'Total'],
      ...Object.entries(reportData.paymentTypeTotals).map(([method, total]) => [
        method || 'Indefinido',
        `R$ ${total}`,
      ]),
    ];

    const dailyReportsData = [
      ['Data', 'Total de Serviços', 'Total de Produtos'],
      ...Object.entries(reportData.dailyReports).map(([date, { totalServices, totalProducts }]) => [
        new Date(date).toLocaleDateString('pt-BR'),
        `R$ ${totalServices}`,
        `R$ ${totalProducts}`,
      ]),
    ];

    const reportDataSheet = [
      ['Relatório Financeiro - Flow Barbershop '],
      [],
      ['Geral'],
      ...generalInfoData,
      [],
      ['Formas de Pagamento'],
      ...paymentMethodsData,
      [],
      ['Relatório Diário'],
      ...dailyReportsData,
    ];

    const reportSheet = XLSX.utils.aoa_to_sheet(reportDataSheet);
    XLSX.utils.book_append_sheet(wb, reportSheet, 'Relatório');

    XLSX.writeFile(wb, 'Relatorio_Financeiro.xlsx');
    console.log('Dados exportados em XLSX!');
    setOpen(false);
  };

  const exportDataPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Relatório Financeiro - Flow Barbershop', 14, 22);

    doc.setFontSize(14);
    doc.text('Geral', 14, 30);

    doc.autoTable({
      startY: 35,
      head: [['Descrição', 'Valor']],
      body: [
        ['Total de Serviços', `R$ ${reportData.totalServicesAmount}`],
        ['Total de Produtos', `R$ ${reportData.totalProductsAmount}`],
        ['Total Geral', `R$ ${reportData.totalAmount}`],
      ],
      theme: 'striped',
    });

    doc.text('Formas de Pagamento', 14, doc.autoTable.previous.finalY + 10);

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 15,
      head: [['Forma de Pagamento', 'Total']],
      body: Object.entries(reportData.paymentTypeTotals).map(([method, total]) => [
        method || 'Indefinido',
        `R$ ${total}`,
      ]),
      theme: 'striped',
    });

    doc.text('Relatório Diário', 14, doc.autoTable.previous.finalY + 10);

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 15,
      head: [['Data', 'Total de Serviços', 'Total de Produtos']],
      body: Object.entries(reportData.dailyReports).map(
        ([date, { totalServices, totalProducts }]) => [
          new Date(date).toLocaleDateString('pt-BR'),
          `R$ ${totalServices}`,
          `R$ ${totalProducts}`,
        ]
      ),
      theme: 'striped',
    });

    doc.save('Relatorio_Financeiro.pdf');
    console.log('Dados exportados em PDF!');
    setOpen(false);
  };

  return (
    <>
      <Header icon={<HistoryIcon />} title="Financeiro" />
      <Grid container spacing={3} style={{ padding: '1rem', flexGrow: 1 }}>
        <Grid item xs={12}>
          <InfoText>Período: </InfoText>
          <StyledTextField
            id="startDate"
            label="Data Inicial"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
          />
          <StyledTextField
            id="endDate"
            label="Data Final"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={fetchReportData}>
            Buscar Relatório
          </Button>
          <Divider />
          {reportData && (
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
                  Total de Serviços:<span>R${reportData.totalServicesAmount}</span>
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  Total de Produtos:<span>R${reportData.totalProductsAmount}</span>
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  Total Geral:<span>R${reportData.totalAmount}</span>
                </Typography>
                <Divider />
                <Subtitle variant="h6" gutterBottom>
                  Formas de Pagamento
                </Subtitle>
                {Object.entries(reportData.paymentTypeTotals).map(([method, total], index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    gutterBottom
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    {method || 'Indefinido'}:<span>R${total}</span>
                  </Typography>
                ))}
                <Divider />
                <Subtitle variant="h6" gutterBottom>
                  Relatório Diário
                </Subtitle>
                {Object.entries(reportData.dailyReports).map(
                  ([date, { totalServices, totalProducts }], index) => (
                    <Typography
                      key={index}
                      variant="body1"
                      gutterBottom
                      style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      {new Date(date).toLocaleDateString('pt-BR')}:
                      <span>
                        Serviços: R${totalServices}, Produtos: R${totalProducts}
                      </span>
                    </Typography>
                  )
                )}
              </CardContent>
            </StyledCard>
          )}
          <ExportButton variant="contained" color="primary" onClick={() => setOpen(true)}>
            Exportar Dados
          </ExportButton>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        style={{ display: 'flex', flexDirection: 'column-reverse' }}
      >
        <DialogTitle>Exportar Dados</DialogTitle>
        <DialogContent>Escolha o formato para exportar os dados:</DialogContent>
        <DialogActions style={{ width: '100%', display: 'flex', flexDirection: 'column-reverse' }}>
          <Button
            onClick={() => setOpen(false)}
            color="primary"
            style={{ width: 'calc(50% - 8px)', marginTop: '5px' }}
          >
            Cancelar
          </Button>
          <ExportOptionsButton
            onClick={exportDataXLSX}
            color="primary"
            variant="contained"
            style={{ width: 'calc(50% - 8px)', marginTop: '5px' }}
          >
            Exportar como XLSX
          </ExportOptionsButton>
          <ExportOptionsButton
            onClick={exportDataPDF}
            color="primary"
            variant="contained"
            style={{ width: 'calc(50% - 8px)' }}
          >
            Exportar como PDF
          </ExportOptionsButton>
        </DialogActions>
      </Dialog>

      <Grid container justifyContent="center">
        <FooterNavigation style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2 }} />
      </Grid>
    </>
  );
}

export default Financial;
