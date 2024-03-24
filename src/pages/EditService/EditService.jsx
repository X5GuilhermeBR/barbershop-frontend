import { Button, CircularProgress, Container, Grid, Snackbar, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { createService, deleteService, getServiceById, updateService } from '../../service/api';

function EditService() {
  // ajuste no nome da função
  const location = useLocation();
  const navigate = useNavigate();
  const serviceId = new URLSearchParams(location.search).get('serviceId');

  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const fetchServiceDetails = async () => {
    // ajuste no nome da função
    try {
      const { data } = await getServiceById(serviceId);
      setServiceName(data.name);
      setServiceDescription(data.description);
      setServicePrice(data.price);
    } catch (error) {
      console.error('Erro ao obter detalhes do serviço:', error);
    }
  };

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  const handleSaveService = async () => {
    // ajuste no nome da função
    try {
      setLoading(true);
      if (!serviceId) {
        await createService({
          // ajuste na chamada da função
          name: serviceName, // ajuste no nome do estado
          description: serviceDescription, // ajuste no nome do estado
          price: servicePrice, // ajuste no nome do estado
          disable: false,
        });
        setMessage(
          'Serviço criado com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
        );
      } else {
        await updateService(serviceId, {
          // ajuste na chamada da função
          name: serviceName, // ajuste no nome do estado
          description: serviceDescription, // ajuste no nome do estado
          price: servicePrice, // ajuste no nome do estado
          disable: false,
        });
        setMessage(
          'Serviço atualizado com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
        );
      }
      setSeverity('success');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/configuracoes/servicos'); // ajuste no redirecionamento
      }, 3000);
    } catch (error) {
      console.error('Erro ao salvar o serviço:', error.message);
      setMessage('Erro ao salvar o serviço. Por favor, tente novamente.');
      setSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async () => {
    // ajuste no nome da função
    try {
      setLoading(true);
      await deleteService(serviceId); // ajuste na chamada da função
      setMessage(
        'Serviço excluído com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
      );
      setSeverity('success');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/configuracoes/servicos'); // ajuste no redirecionamento
      }, 3000);
    } catch (error) {
      console.error('Erro ao excluir o serviço:', error.message);
      setMessage('Erro ao excluir o serviço. Por favor, tente novamente.');
      setSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <>
      <Header title={serviceId ? 'Editar Serviço' : 'Criar Serviço'} />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nome"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)} // ajuste no nome do estado
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descrição"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)} // ajuste no nome do estado
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Preço"
              value={servicePrice}
              onChange={(e) => setServicePrice(e.target.value)} // ajuste no nome do estado
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleSaveService} // ajuste no nome da função
              disabled={loading}
            >
              {serviceId ? 'Salvar' : 'Criar'}
              {loading && <CircularProgress size={24} />}
            </Button>
          </Grid>
          {serviceId && (
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="error"
                size="large"
                fullWidth
                onClick={handleDeleteService} // ajuste no nome da função
                disabled={loading}
              >
                Excluir
                {loading && <CircularProgress size={24} />}
              </Button>
            </Grid>
          )}
        </Grid>
      </Container>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={handleAlertClose} severity={severity}>
          {message}
        </MuiAlert>
      </Snackbar>
      <FooterNavigation />
    </>
  );
}

export default EditService;
