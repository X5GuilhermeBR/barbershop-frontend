/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-array-index-key */
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
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
  padding-bottom: 16px;
  padding-top: 16px;
`;

const Subtitle = styled(Typography)`
  && {
    color: ${colors.third};
    text-transform: uppercase;
    font-size: 16px;
    font-family: 'Bahnschrift', sans-serif;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.basic};
  margin: 8px 0;
`;

export const DividerBlock = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.basic};
  margin: 30px 0;
`;

export const Box = styled.div`
  margin-bottom: 30px;
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
    width: 100%;
    padding: 12px;
    background-color: ${(props) => props.backgroundColor || '#f6a700'};
    color: black;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    height: 55px;
    margin-top: 20px;
    font-weight: bold;
    -webkit-box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    text-transform: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4rem;
  }
`;

const ExportOptionsButton = styled(Button)`
  && {
    margin: 0 5px; /* Adicionando espaçamento entre os botões */
    background-color: ${colors.red}; /* Alterando a cor do botão para vermelho */
  }
`;

const SearchButton = styled(Button)`
  && {
    width: 100%;
    padding: 12px;
    background-color: ${(props) => props.backgroundColor || '#f6a700'};
    color: ${(props) => props.color || 'black'};
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    height: 55px;
    margin-top: 20px;
    font-weight: bold;
    -webkit-box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 19px 0px rgba(0, 0, 0, 0.75);
    text-transform: none;
    display: flex;
    align-items: center;
    justify-content: center;
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

    const servicesData = [
      ['ID Serviço', 'Nome', 'Quantidade', 'Valor Total'],
      ...reportData.services.map((service) => [
        service.id_service,
        service.name,
        service.count,
        `R$ ${service.total_value}`,
      ]),
    ];

    const productsData = [
      ['ID Produto', 'Nome', 'Quantidade', 'Valor Total'],
      ...reportData.products.map((product) => [
        product.id_product,
        product.name,
        product.count,
        `R$ ${product.total_value}`,
      ]),
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
      ['Serviços'],
      ...servicesData,
      [],
      ['Produtos'],
      ...productsData,
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

    doc.text('Serviços', 14, doc.autoTable.previous.finalY + 10);

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 15,
      head: [['ID Serviço', 'Nome', 'Quantidade', 'Valor Total']],
      body: reportData.services.map((service) => [
        service.id_service,
        service.name,
        service.count,
        `R$ ${service.total_value}`,
      ]),
      theme: 'striped',
    });

    doc.text('Produtos', 14, doc.autoTable.previous.finalY + 10);

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 15,
      head: [['ID Produto', 'Nome', 'Quantidade', 'Valor Total']],
      body: reportData.products.map((product) => [
        product.id_product,
        product.name,
        product.count,
        `R$ ${product.total_value}`,
      ]),
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
          <InfoText>Período Inicial</InfoText>
          <StyledTextField
            id="startDate"
            placeholder="Selecione a data Inicial"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
          />
          <InfoText>Período Final: </InfoText>
          <StyledTextField
            id="endDate"
            placeholder="Selecione a data Final"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
          />
          <SearchButton variant="contained" onClick={fetchReportData} startIcon={<SearchIcon />}>
            BUSCAR RELATÓRIO
          </SearchButton>
          <DividerBlock />
          {reportData && (
            <StyledCard>
              <CardContent>
                <Box>
                  <Subtitle variant="h6" gutterBottom>
                    Geral
                  </Subtitle>
                  <Typography
                    variant="body1"
                    gutterBottom
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}
                  >
                    Total de Serviços:<span>R${reportData.totalServicesAmount}</span>
                  </Typography>
                  <Divider />
                  <Typography
                    variant="body1"
                    gutterBottom
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '18px',
                    }}
                  >
                    Total de Produtos:<span>R${reportData.totalProductsAmount}</span>
                  </Typography>
                  <Divider />
                  <Typography
                    variant="body1"
                    gutterBottom
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}
                  >
                    Total Geral:<span>R${reportData.totalAmount}</span>
                  </Typography>
                  <Divider />
                </Box>
                <Box>
                  <Subtitle variant="h6" gutterBottom>
                    Serviços
                  </Subtitle>
                  {reportData.services.map((service, index) => (
                    <div key={index}>
                      <Typography
                        variant="body1"
                        gutterBottom
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '18px',
                        }}
                      >
                        {`${service.name}: `} <span>{`R$ ${service.total_value}`}</span>
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        style={{
                          display: 'flex',
                          marginTop: '-8px',
                          justifyContent: 'space-between',
                          fontSize: '14px',
                        }}
                      >
                        {`${service.count}x realizado`}
                      </Typography>
                      <Divider />
                    </div>
                  ))}
                </Box>
                <Box>
                  <Subtitle variant="h6" gutterBottom>
                    Produtos
                  </Subtitle>
                  {reportData.products.map((product, index) => (
                    <div key={index}>
                      <Typography
                        variant="body1"
                        gutterBottom
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '18px',
                        }}
                      >
                        {`${product.name}: `} <span>{`R$ ${product.total_value}`}</span>
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        style={{
                          display: 'flex',
                          marginTop: '-8px',
                          justifyContent: 'space-between',
                          fontSize: '14px',
                        }}
                      >
                        {`${product.count} unidades vendidas`}
                      </Typography>
                      <Divider />
                    </div>
                  ))}
                </Box>
                <Box>
                  <Subtitle variant="h6" gutterBottom>
                    Formas de Pagamento
                  </Subtitle>
                  {Object.entries(reportData.paymentTypeTotals).map(([method, total], index) => (
                    <>
                      <Typography
                        key={index}
                        variant="body1"
                        gutterBottom
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '18px',
                        }}
                      >
                        {method || 'Indefinido'}:<span>R${total}</span>
                      </Typography>
                      <Divider />
                    </>
                  ))}
                </Box>
                <Box>
                  <Subtitle variant="h6" gutterBottom>
                    Relatório Diário
                  </Subtitle>
                  {Object.entries(reportData.dailyReports).map(
                    ([date, { totalServices, totalProducts }], index) => (
                      <div
                        key={index}
                        style={{
                          paddingBottom: '15px',
                        }}
                      >
                        <Typography
                          variant="body1"
                          gutterBottom
                          style={{
                            fontSize: '18px',
                            color: colors.second,
                            fontWeight: 'bold',
                          }}
                        >
                          {new Date(date).toLocaleDateString('pt-BR')}
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '18px',
                          }}
                        >
                          Serviço:<span>R${totalServices}</span>
                        </Typography>
                        <Divider />
                        <Typography
                          variant="body1"
                          gutterBottom
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '18px',
                          }}
                        >
                          Produto:<span>R${totalProducts}</span>
                        </Typography>
                        <Divider />
                      </div>
                    )
                  )}
                </Box>
              </CardContent>
            </StyledCard>
          )}
          <ExportButton variant="contained" color="primary" onClick={() => setOpen(true)}>
            EXPORTAR DADOS{' '}
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
