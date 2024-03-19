import { Delete, Lock, LockOpen, Search } from '@mui/icons-material';
import GroupsIcon from '@mui/icons-material/Groups';
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
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { getByProfile } from '../../service/api';

function Clients() {
  // Estados
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationDialogAction, setConfirmationDialogAction] = useState(null);
  const [confirmationDialogUserId, setConfirmationDialogUserId] = useState(null);
  const [selectedProfile] = useState('clients');

  // Efeito para carregar usuários com base no perfil selecionado
  useEffect(() => {
    async function fetchClients() {
      try {
        const { data } = await getByProfile('clients'); // Assumindo que 'Clients' seja o perfil dos clientes
        if (Array.isArray(data)) {
          // Ordenar os usuários em ordem alfabética pelo nome
          data.sort((a, b) => (a.client_name > b.client_name ? 1 : -1));
          setUsers(data);
        } else {
          console.error('Dados inválidos retornados pela API:', data);
        }
      } catch (error) {
        console.error('Erro ao obter clientes:', error);
      }
    }

    fetchClients();
  }, [selectedProfile]);

  // Função para abrir a modal de confirmação
  const handleOpenConfirmationDialog = (action, userId) => {
    setConfirmationDialogAction(action);
    setConfirmationDialogUserId(userId);
    setConfirmationDialogOpen(true);
  };

  // Função para fechar a modal de confirmação
  const handleCloseConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
    setConfirmationDialogAction(null);
    setConfirmationDialogUserId(null);
  };

  // Função para deletar um usuário
  const handleDeleteUser = () => {
    const updatedUsers = users.filter((user) => user.user_id !== confirmationDialogUserId);
    setUsers(updatedUsers);
    handleCloseConfirmationDialog();
  };

  // Função para habilitar ou desabilitar um usuário
  const handleToggleUser = () => {
    const updatedUsers = users.map((user) => {
      if (user.user_id === confirmationDialogUserId) {
        return { ...user, enabled: !user.enabled };
      }
      return user;
    });
    setUsers(updatedUsers);
    handleCloseConfirmationDialog();
  };

  // Função para filtrar os usuários com base no termo de busca
  const filteredUsers =
    Array.isArray(users) &&
    users.filter(
      (user) =>
        user.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <Header icon={<GroupsIcon />} title="Clientes" />
      <Container>
        <Typography variant="h4" gutterBottom>
          Agenda Telefônica
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
          {Array.isArray(filteredUsers) &&
            filteredUsers.map((user) => (
              <Grid item key={user.user_id} xs={12} md={6} lg={4}>
                <div
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <Typography variant="h6">
                      {user.client_name.split(' ')[0]} {/* Exibe apenas o primeiro nome */}{' '}
                      {user.client_name.split(' ').slice(-1)} {/* Exibe apenas o último nome */}
                    </Typography>
                    <Typography variant="body1">{user.email}</Typography>
                  </div>
                  <div>
                    <IconButton
                      onClick={() => handleOpenConfirmationDialog('delete', user.user_id)}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenConfirmationDialog('toggle', user.user_id)}
                    >
                      {user.enabled ? <LockOpen /> : <Lock />}
                    </IconButton>
                  </div>
                </div>
              </Grid>
            ))}
        </Grid>
      </Container>
      <FooterNavigation />

      {/* Modal de confirmação de ação */}
      <Dialog
        open={confirmationDialogOpen}
        onClose={handleCloseConfirmationDialog}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            {confirmationDialogAction === 'delete'
              ? 'Tem certeza de que deseja excluir este usuário?'
              : 'Tem certeza de que deseja alterar o status deste usuário?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={confirmationDialogAction === 'delete' ? handleDeleteUser : handleToggleUser}
            color="primary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Clients;
