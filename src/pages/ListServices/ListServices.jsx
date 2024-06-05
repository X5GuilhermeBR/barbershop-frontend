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
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { getServices, updateServiceStatus } from '../../service/api'; // Importe as funções necessárias para serviços
import colors from '../../utils/colors';

const StyledTextField = styled(TextField)`
  background-color: white; // Define o fundo como branco
  color: black; // Define a cor do texto como preto
`;

const StyledButton = styled(Button)`
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
    text-decoration: none !important;
  }
`;

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

  const handleCreateService = () => {
    navigate(`/configuracoes/servicos/novo-servico`);
  };

  return (
    <>
      <Header title="Serviços" />
      <Container>
        <StyledTextField
          placeholder="Buscar"
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
            <StyledButton onClick={handleCreateService}>CRIAR NOVO SERVIÇO</StyledButton>
          </Grid>
          {filteredServices &&
            filteredServices.map((service) => (
              <Grid item key={service.id} xs={12} md={6} lg={4}>
                <div
                  style={{
                    padding: '10px',
                    marginBottom: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: colors.primary,
                  }}
                >
                  <div>
                    <Typography
                      variant="h6"
                      style={{ color: colors.third, fontSize: '18px', maxWidth: '270px' }}
                    >
                      {service.name.toUpperCase()}
                    </Typography>
                    <Typography variant="body1" style={{ maxWidth: '270px' }}>
                      {service.description}
                    </Typography>
                    <Typography variant="body1" style={{ color: 'green', fontSize: '12px' }}>
                      {`R$${service.price}`}
                    </Typography>
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <IconButton
                      onClick={() => handleEditClick(service.id)}
                      style={{ color: 'white' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleToggleServiceStatus(service.id)}>
                      {service.disable ? (
                        <Lock style={{ color: 'white' }} />
                      ) : (
                        <LockOpen style={{ color: 'white' }} />
                      )}
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
