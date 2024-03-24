import { Edit, Lock, LockOpen, Search } from '@mui/icons-material';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { getServices, updateServiceStatus } from '../../service/api'; // Importe as funções necessárias para serviços

function ListServices() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data } = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Erro ao obter serviços:', error);
      }
    }

    fetchServices();
  }, []);

  const handleEditClick = (serviceId) => {
    navigate(`/configuracoes/servicos/novo-servico?serviceId=${serviceId}`);
  };

  const handleToggleServiceStatus = (serviceId) => {
    setSelectedServiceId(serviceId);
    setConfirmationDialogOpen(true);
  };

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
    setSelectedServiceId(null);
  };

  const handleConfirmToggleStatus = async () => {
    try {
      const updatedServices = services.map((service) => {
        if (service.id === selectedServiceId) {
          const newStatus = !service.disable;
          updateServiceStatus(selectedServiceId, newStatus);
          return { ...service, disable: newStatus };
        }
        return service;
      });
      setServices(updatedServices);
      setConfirmationDialogOpen(false);
    } catch (error) {
      console.error('Erro ao alternar o status do serviço:', error);
    }
  };

  const filteredServices =
    services &&
    Array.isArray(services) &&
    services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <Header title="Serviços" />
      <Container>
        <Typography variant="h4" gutterBottom>
          Lista de Serviços
        </Typography>
        <TextField
          label="Buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            ),
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Link to="/configuracoes/servicos/novo-servico">
              <Button variant="contained" color="primary" fullWidth style={{ borderRadius: 0 }}>
                Criar Novo Serviço
              </Button>
            </Link>
          </Grid>
          {filteredServices &&
            filteredServices.map((service) => (
              <Grid item key={service.id} xs={12} md={6} lg={4}>
                <div
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h6">{service.name}</Typography>
                  <Typography variant="body1">{service.description}</Typography>
                  <Typography variant="body1">{service.price}</Typography>
                  <div style={{ marginTop: 'auto' }}>
                    <IconButton onClick={() => handleEditClick(service.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleToggleServiceStatus(service.id)}>
                      {service.disable ? <LockOpen /> : <Lock />}
                    </IconButton>
                  </div>
                </div>
              </Grid>
            ))}
        </Grid>
      </Container>
      <FooterNavigation />

      <Dialog
        open={confirmationDialogOpen}
        onClose={handleCloseConfirmationDialog}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            Tem certeza de que deseja alterar o status deste serviço?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmToggleStatus} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ListServices;
