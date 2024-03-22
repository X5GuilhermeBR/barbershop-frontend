import { Delete, Lock, LockOpen, Search, WhatsApp } from '@mui/icons-material';
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

function formatPhoneNumber(phoneNumber) {
  const cleaned = `${phoneNumber}`.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
  if (match) {
    return `+55 (${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
  }
  return null;
}

function Clients() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationDialogAction, setConfirmationDialogAction] = useState(null);
  const [confirmationDialogUserId, setConfirmationDialogUserId] = useState(null);
  const [selectedProfile] = useState('clients');

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data } = await getByProfile('clients');
        if (Array.isArray(data)) {
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

  const handleOpenConfirmationDialog = (action, userId) => {
    setConfirmationDialogAction(action);
    setConfirmationDialogUserId(userId);
    setConfirmationDialogOpen(true);
  };

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
    setConfirmationDialogAction(null);
    setConfirmationDialogUserId(null);
  };

  const handleDeleteUser = () => {
    const updatedUsers = users.filter((user) => user.user_id !== confirmationDialogUserId);
    setUsers(updatedUsers);
    handleCloseConfirmationDialog();
  };

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
                      {user.client_name.split(' ')[0]} {user.client_name.split(' ').slice(-1)}
                    </Typography>
                    <Typography variant="body1">{user.email}</Typography>
                    <Typography variant="body1">
                      {formatPhoneNumber(user.client_cellphone)}
                    </Typography>
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
                    <IconButton
                      href={`https://wa.me/55${user.client_cellphone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsApp />
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
