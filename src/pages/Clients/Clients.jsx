import { Lock, LockOpen, Search, WhatsApp } from '@mui/icons-material';
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
import styled from 'styled-components';
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { getByProfile, updateStatusUser } from '../../service/api';
import colors from '../../utils/colors';

function formatPhoneNumber(phoneNumber) {
  const cleaned = `${phoneNumber}`.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
  if (match) {
    return `+55 (${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
  }
  return null;
}

// Estiliza o componente TextField com styled-components
const StyledTextField = styled(TextField)`
  background-color: white; // Define o fundo como branco
  color: black; // Define a cor do texto como preto
`;

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

  const handleToggleUser = async () => {
    const updatedUsers = users.map((user) => {
      if (user.user_id === confirmationDialogUserId) {
        const newStatus = !user.disable; // Alternar o status
        updateStatusUser(user.user_id, !user.disable); // Chamar a função updateStatusAccount com o ID do usuário e o novo status
        return { ...user, disable: newStatus };
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
        <StyledTextField
          placeholder="Buscar por Nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <IconButton>
                <Search style={{ color: 'white' }} />
              </IconButton>
            ),
          }}
        />
        <Grid container spacing={2}>
          {Array.isArray(filteredUsers) &&
            filteredUsers.map((user) => {
              const nameParts = user.client_name.split(' ');
              const firstName = nameParts[0].toUpperCase();
              const lastName = nameParts[nameParts.length - 1].toUpperCase();

              return (
                <Grid item key={user.user_id} xs={12} md={6} lg={4}>
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
                      <Typography variant="h6" style={{ color: colors.third, fontSize: '18px' }}>
                        {firstName} {lastName}
                      </Typography>
                      <Typography variant="body1">{user.email}</Typography>
                      <Typography variant="body1">
                        {formatPhoneNumber(user.client_cellphone)}
                      </Typography>
                    </div>
                    <div>
                      <IconButton
                        onClick={() => handleOpenConfirmationDialog('toggle', user.user_id)}
                      >
                        {user.disable ? (
                          <LockOpen style={{ color: 'white' }} />
                        ) : (
                          <Lock style={{ color: 'white' }} />
                        )}
                      </IconButton>
                      <IconButton
                        href={`https://wa.me/55${user.client_cellphone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WhatsApp style={{ color: 'white' }} />
                      </IconButton>
                    </div>
                  </div>
                </Grid>
              );
            })}
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
          <Button onClick={handleToggleUser} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Clients;
