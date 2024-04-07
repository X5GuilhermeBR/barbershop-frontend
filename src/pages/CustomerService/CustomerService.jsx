/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
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
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { createSale, getProducts, getScheduleById, updateSchedule } from '../../service/api'; // Importa a função getProducts

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
  const [fakeProducts, setFakeProducts] = useState([]); // State para armazenar os produtos
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const scheduleId = params.get('scheduleId');

  // Busca os produtos assim que o componente for montado
  useEffect(() => {
    getProducts()
      .then((response) => {
        setFakeProducts(response.data); // Define os produtos obtidos na state fakeProducts
      })
      .catch((error) => {
        console.error('Erro ao buscar produtos:', error);
      });
  }, []); // Esta função só precisa ser chamada uma vez, então passamos um array vazio como dependência

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
          setServiceCost(scheduleData.serviceCost); // Definir o custo do serviço
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

  // Função para adicionar produto ao carrinho
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

  // Função para remover produto do carrinho
  const handleRemoveFromCart = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  // Função para iniciar o atendimento
  const handleStartService = async () => {
    setIsProcessing(true);
    try {
      const updatedSchedule = await updateSchedule(scheduleId, {
        status: 'Em Andamento',
        started_service: new Date(),
        payment_method: paymentMethod, // Adiciona a forma de pagamento ao iniciar o serviço
      });
      console.log('Atendimento iniciado:', updatedSchedule);
      setScheduleStatus('Em Andamento'); // Atualizar o status do botão
      setIsProcessing(false);
    } catch (error) {
      console.error('Erro ao iniciar o atendimento:', error);
      setIsProcessing(false);
    }
  };

  const handleFinishService = async () => {
    setIsProcessing(true);
    try {
      // Atualiza o status do atendimento para 'Finalizado'
      const updatedSchedule = await updateSchedule(scheduleId, {
        status: 'Finalizado',
        finished_service: new Date(),
        payment_method: paymentMethod,
      });
      console.log('Atendimento finalizado:', updatedSchedule);

      // Cria as vendas para cada produto no carrinho
      await Promise.all(
        selectedProducts.map(async (item) => {
          try {
            const saleData = {
              id_schedule: scheduleId,
              id_product: item.product.id,
              quantity: item.quantity,
            };

            // Chama o serviço createSales para criar uma venda
            await createSale(saleData);
            console.log('Venda criada para o produto:', item.product.id);
          } catch (error) {
            console.error('Erro ao criar venda para o produto:', item.product.id, error);
          }
        })
      );

      setIsProcessing(false);
    } catch (error) {
      console.error('Erro ao finalizar o atendimento:', error);
      setIsProcessing(false);
    }
  };

  // Função para editar o atendimento
  const handleEditService = () => {
    // Adicione aqui a lógica para redirecionar para a página de edição de atendimento
    navigate(`/editar-atendimento/${scheduleId}`);
  };

  // Função para controlar a mudança na forma de pagamento
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // Calcular o total do consumo
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
          <Typography variant="h6" style={{ marginBottom: '1rem' }}>
            Detalhes do Serviço - Status: {scheduleStatus}
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '1rem' }}>
            Cliente: {clientName}
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '1rem' }}>
            Barbeiro: {barberName}
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '1rem' }}>
            Hora do Corte: {scheduledTime} - Data do Corte: {scheduledDate}
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '1rem' }}>
            Serviço: {scheduleService} - Valor do Serviço: R$ {serviceCost}
          </Typography>
          {scheduleStatus !== 'Agendado' && (
            <>
              <FormControl fullWidth style={{ marginBottom: '1rem' }}>
                <InputLabel id="product-label">Produto</InputLabel>
                <Select
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
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: '1rem' }}>
                <InputLabel id="quantity-label">Quantidade</InputLabel>
                <Select
                  labelId="quantity-label"
                  id="quantity-select"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(e.target.value)}
                >
                  {[...Array(5).keys()].map((quantity) => (
                    <MenuItem key={quantity} value={quantity}>
                      {quantity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                fullWidth
                style={{ marginBottom: '1rem' }}
              >
                Adicionar ao Carrinho
              </Button>
            </>
          )}
          <Typography variant="h6" style={{ marginBottom: '1rem' }}>
            Carrinho:
          </Typography>
          {selectedProducts.length > 0 ? (
            <List>
              {selectedProducts.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${item.product.name} - R$${item.product.price} x ${item.quantity}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveFromCart(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              <Typography variant="subtitle1" style={{ marginTop: '1rem' }}>
                Valor do Consumo: R$ {totalConsumption}
              </Typography>
              <Typography variant="subtitle1">
                Total: R$ {serviceCost + totalConsumption}
              </Typography>
            </List>
          ) : (
            <Typography variant="subtitle1" style={{ marginTop: '1rem' }}>
              Carrinho vazio
            </Typography>
          )}
          {scheduleStatus !== 'Agendado' && (
            <>
              <Typography variant="h6" style={{ marginTop: '1rem' }}>
                Forma de Pagamento:
              </Typography>
              <FormControl component="fieldset" style={{ marginBottom: '1rem' }}>
                <RadioGroup
                  aria-label="forma-pagamento"
                  name="forma-pagamento"
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                >
                  <FormControlLabel value="PIX" control={<Radio />} label="PIX" />
                  <FormControlLabel value="Dinheiro" control={<Radio />} label="Dinheiro" />
                  <FormControlLabel value="Débito" control={<Radio />} label="Débito" />
                  <FormControlLabel value="Crédito" control={<Radio />} label="Crédito" />
                </RadioGroup>
              </FormControl>
            </>
          )}
          {isProcessing ? (
            <Button disabled fullWidth style={{ marginTop: '1rem' }}>
              <CircularProgress size={24} /> Processando...
            </Button>
          ) : scheduleStatus === 'Em Andamento' ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleFinishService}
              fullWidth
              style={{ marginTop: '1rem' }}
            >
              Finalizar Atendimento
            </Button>
          ) : scheduleStatus === 'Finalizado' ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditService}
              fullWidth
              style={{ marginTop: '1rem' }}
            >
              Editar Atendimento
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartService}
              fullWidth
              style={{ marginTop: '1rem' }}
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
