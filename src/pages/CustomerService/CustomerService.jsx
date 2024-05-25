/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { createSale, getProducts, getScheduleById, updateSchedule } from '../../service/api';
import colors from '../../utils/colors';

const StyledTextField = styled(Select)`
  background-color: white; // Define o fundo como branco
  color: black; // Define a cor do texto como preto
`;

const InfoText = styled.div`
  color: ${colors.third};
  font-size: 20px;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.basic};
  margin: 30px 0;
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  color: ${colors.third};
`;

export const StyledCardContent = styled(CardContent)`
  && {
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${colors.primary};
    color: white;

    h2 {
      font-size: 16px;
      margin-bottom: 10px;
      color: ${colors.third};
    }

    p {
      font-size: 16px;
      line-height: 28px;
      margin-bottom: 10px;
    }
  }
`;

export const StyledListItem = styled(ListItem)`
  && {
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${colors.basic};
    color: white;

    h2 {
      font-size: 16px;
      margin-bottom: 10px;
      color: ${colors.third};
    }

    p {
      font-size: 16px;
      line-height: 28px;
      margin-bottom: 10px;
    }
  }
`;

export const StyledChip = styled(Chip)`
  && {
    font-size: 10px;
    margin-right: 5px;
    background-color: ${({ type }) => {
      switch (type) {
        case 'Marcado':
          return '#94c7b6';
        case 'Encaixe':
          return '#de6262';
        case 'Finalizado':
          return colors.third;
        case 'Cancelado':
          return colors.third;
        default:
          return colors.third;
      }
    }};
    color: ${colors.primary};
    font-weight: bold;
    height: 20px;

    span {
      padding: 3px 6px 0px 6px;
    }
  }
`;

const styles = {
  radio: {
    color: 'white',
    '&.Mui-checked': {
      color: 'white',
    },
  },
};

function CustomerService() {
  const [clientName, setClientName] = useState('');
  const [barberName, setBarberName] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduleService, setScheduleService] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [serviceCost, setServiceCost] = useState(0);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [fakeProducts, setFakeProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const scheduleId = params.get('scheduleId');

  useEffect(() => {
    getProducts()
      .then((response) => {
        setFakeProducts(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar produtos:', error);
      });
  }, []);

  useEffect(() => {
    if (scheduleId) {
      getScheduleById(scheduleId)
        .then((response) => {
          const scheduleData = response.data;
          setClientName(scheduleData.clientName);
          setBarberName(scheduleData.barberName);
          setScheduledTime(scheduleData.time);
          setScheduledDate(scheduleData.date);
          setScheduleService(scheduleData.serviceName);
          setServiceCost(scheduleData.serviceCost);
          setScheduleStatus(scheduleData.status);
        })
        .catch((error) => {
          console.error('Error fetching schedule:', error);
          navigate('/agenda');
        });
    } else {
      navigate('/agenda');
    }
  }, [location.search, navigate, scheduleId]);

  const handleAddToCart = () => {
    if (selectedProduct && selectedQuantity > 0) {
      const productToAdd = fakeProducts.find((product) => product.id === selectedProduct);
      setSelectedProducts([
        ...selectedProducts,
        { product: productToAdd, quantity: selectedQuantity },
      ]);
      setSelectedProduct('');
      setSelectedQuantity(0);
    }
  };

  const handleRemoveFromCart = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  const handleStartService = async () => {
    setIsProcessing(true);
    try {
      const updatedSchedule = await updateSchedule(scheduleId, {
        status: 'Em Andamento',
        started_service: new Date(),
        payment_method: paymentMethod,
      });
      console.log('Atendimento iniciado:', updatedSchedule);
      setScheduleStatus('Em Andamento');
      setIsProcessing(false);
    } catch (error) {
      console.error('Erro ao iniciar o atendimento:', error);
      setIsProcessing(false);
    }
  };

  const handleFinishService = async () => {
    setIsProcessing(true);
    try {
      const updatedSchedule = await updateSchedule(scheduleId, {
        status: 'Finalizado',
        finished_service: new Date(),
        payment_method: paymentMethod,
      });
      console.log('Atendimento finalizado:', updatedSchedule);

      await Promise.all(
        selectedProducts.map(async (item) => {
          try {
            const saleData = {
              id_schedule: scheduleId,
              id_product: item.product.id,
              quantity: item.quantity,
            };
            await createSale(saleData);
            console.log('Venda criada para o produto:', item.product.id);
          } catch (error) {
            console.error('Erro ao criar venda para o produto:', item.product.id, error);
          }
        })
      );

      setIsProcessing(false);
      setTimeout(() => navigate('/agenda'), 1000);
    } catch (error) {
      console.error('Erro ao finalizar o atendimento:', error);
      setIsProcessing(false);
    }
  };

  const handleEditService = () => {
    navigate(`/editar-atendimento/${scheduleId}`);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  useEffect(() => {
    const totalConsum = selectedProducts.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    setTotalConsumption(totalConsum);
  }, [selectedProducts]);

  return (
    <>
      <Header icon="" title="Atendimento ao Cliente" />
      <Grid
        container
        justifyContent="center"
        style={{
          marginBottom: '4rem',
          marginTop: '1rem',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="sm">
          <StyledCardContent>
            <h2>DETALHES DO SERVIÇO</h2>
            <StyledChip label={scheduleStatus.toUpperCase()} status={scheduleStatus} />
            <p>
              <strong>Cliente:</strong> {clientName}
              <br />
              <strong>Barbeiro:</strong> {barberName}
              <br />
              <strong>Serviço:</strong> {scheduleService}
              <br />
              <strong>Data:</strong> {scheduledDate}
              <br />
              <strong>Hora:</strong> {scheduledTime}
              <br />
              <strong>Valor:</strong> R${serviceCost},00
              <br />
            </p>
          </StyledCardContent>

          {scheduleStatus !== 'Agendado' && (
            <>
              <Divider />
              <Title>Carrinho</Title>

              <FormControl fullWidth style={{ marginBottom: '1rem' }}>
                <InfoText>Produto</InfoText>
                <StyledTextField
                  labelId="product-label"
                  id="product-select"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Selecione um produto</em>
                  </MenuItem>
                  {fakeProducts.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} - R${product.price}
                    </MenuItem>
                  ))}
                </StyledTextField>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: '1rem' }}>
                <InfoText>Quantidade</InfoText>
                <StyledTextField
                  labelId="quantity-label"
                  id="quantity-select"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(e.target.value)}
                >
                  {[...Array(5).keys()].map((quantity) => (
                    <MenuItem key={quantity + 1} value={quantity + 1}>
                      {quantity + 1}
                    </MenuItem>
                  ))}
                </StyledTextField>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                fullWidth
                style={{
                  marginBottom: '1rem',
                  height: '55px',
                  borderColor: colors.second,
                  borderWidth: '1px', // Adding borderWidth
                  marginTop: '1rem',
                  borderStyle: 'solid',
                  backgroundColor: 'transparent',
                  color: colors.second,
                }}
              >
                Adicionar ao Carrinho
              </Button>

              <StyledCardContent>
                <h2>CARRINHO</h2>
                {selectedProducts.length > 0 ? (
                  <List>
                    {selectedProducts.map((item, index) => (
                      <StyledListItem key={index}>
                        <ListItemText
                          primary={`${item.product.name} - R$${item.product.price} x ${item.quantity}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            <DeleteIcon style={{ color: 'white' }} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </StyledListItem>
                    ))}
                    <Typography variant="subtitle1" style={{ marginTop: '1rem' }}>
                      Valor do Consumo: R${totalConsumption},00
                    </Typography>
                    <Typography variant="subtitle1">
                      Total: R${Number(serviceCost) + Number(totalConsumption)},00
                    </Typography>
                  </List>
                ) : (
                  <Typography
                    variant="subtitle1"
                    style={{ marginTop: '1rem', textAlign: 'center', fontSize: '14px' }}
                  >
                    NENHUM PRODUTO ADICIONADO
                  </Typography>
                )}
              </StyledCardContent>
              <Divider />
              <Title>Pagamento</Title>
              {scheduleStatus !== 'Agendado' && (
                <FormControl
                  component="fieldset"
                  style={{ marginBottom: '0rem', marginTop: '-1rem' }}
                >
                  <RadioGroup
                    aria-label="forma-pagamento"
                    name="forma-pagamento"
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                  >
                    <FormControlLabel
                      value="PIX"
                      control={<Radio sx={styles.radio} />}
                      label="PIX"
                    />
                    <FormControlLabel
                      value="Dinheiro"
                      control={<Radio sx={styles.radio} />}
                      label="Dinheiro"
                    />
                    <FormControlLabel
                      value="Débito"
                      control={<Radio sx={styles.radio} />}
                      label="Débito"
                    />
                    <FormControlLabel
                      value="Crédito"
                      control={<Radio sx={styles.radio} />}
                      label="Crédito"
                    />
                  </RadioGroup>
                </FormControl>
              )}
            </>
          )}
          {isProcessing ? (
            <Button disabled fullWidth style={{ marginTop: '1rem' }}>
              <CircularProgress size={24} /> Processando...
            </Button>
          ) : scheduleStatus === 'Em Andamento' ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleFinishService}
              fullWidth
              style={{
                marginBottom: '1rem',
                height: '55px',
                backgroundColor: colors.second,
                color: 'black',
                marginTop: '1rem',
              }}
            >
              Finalizar Atendimento
            </Button>
          ) : scheduleStatus === 'Finalizado' ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditService}
              fullWidth
              style={{
                marginTop: '1rem',
                marginBottom: '1rem',
                height: '55px',
                backgroundColor: colors.second,
                color: 'black',
              }}
            >
              Editar Atendimento
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartService}
              fullWidth
              style={{
                marginTop: '1rem',
                marginBottom: '1rem',
                height: '55px',
                backgroundColor: colors.second,
                color: 'black',
              }}
            >
              Iniciar Atendimento
            </Button>
          )}
        </Container>
      </Grid>
      <FooterNavigation />
    </>
  );
}

export default CustomerService;
