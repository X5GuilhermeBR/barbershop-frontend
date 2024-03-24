import { Button, CircularProgress, Container, Grid, Snackbar, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { createService, deleteService, getServiceById, updateService } from '../../service/api';

function EditService() {
  const location = useLocation();
  const navigate = useNavigate();
  const serviceId = new URLSearchParams(location.search).get('serviceId');

  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceTime, setServiceTime] = useState(''); // Novo estado para o tempo estimado
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const fetchServiceDetails = async () => {
    try {
      const { data } = await getServiceById(serviceId);
      setServiceName(data.name);
      setServiceDescription(data.description);
      setServicePrice(data.price);
      setServiceTime(data.average_duration); // Define o tempo estimado recuperado do serviço
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
    try {
      setLoading(true);
      if (!serviceId) {
        await createService({
          name: serviceName,
          description: serviceDescription,
          price: servicePrice,
          average_duration: serviceTime, // Inclui o tempo estimado ao criar um serviço
          disable: false,
        });
        setMessage(
          'Serviço criado com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
        );
      } else {
        await updateService(serviceId, {
          name: serviceName,
          description: serviceDescription,
          price: servicePrice,
          average_duration: serviceTime, // Inclui o tempo estimado ao atualizar um serviço
          disable: false,
        });
        setMessage(
          'Serviço atualizado com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
        );
      }
      setSeverity('success');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/configuracoes/servicos');
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
    try {
      setLoading(true);
      await deleteService(serviceId);
      setMessage(
        'Serviço excluído com sucesso! Você será redirecionado para a tela inicial em 3 segundos...'
      );
      setSeverity('success');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/configuracoes/servicos');
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
              onChange={(e) => setServiceName(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descrição"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Preço"
              value={servicePrice}
              onChange={(e) => setServicePrice(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tempo Estimado"
              value={serviceTime}
              onChange={(e) => setServiceTime(e.target.value)}
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
              onClick={handleSaveService}
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
                onClick={handleDeleteService}
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
