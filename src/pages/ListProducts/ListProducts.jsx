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
import { getProducts, updateProductStatus } from '../../service/api';
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

function ListProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Erro ao obter produtos:', error);
      }
    }

    fetchProducts();
  }, []);

  const handleEditClick = (productId) => {
    navigate(`/configuracoes/produtos/novo-produto?productId=${productId}`);
  };

  const handleToggleProductStatus = (productId) => {
    setSelectedProductId(productId);
    setConfirmationDialogOpen(true);
  };

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
    setSelectedProductId(null);
  };

  const handleConfirmToggleStatus = async () => {
    try {
      const updatedProducts = products.map((product) => {
        if (product.id === selectedProductId) {
          const newStatus = !product.disable;
          updateProductStatus(selectedProductId, newStatus);
          return { ...product, disable: newStatus };
        }
        return product;
      });
      setProducts(updatedProducts);
      setConfirmationDialogOpen(false);
    } catch (error) {
      console.error('Erro ao alternar o status do produto:', error);
    }
  };

  const filteredProducts =
    products &&
    Array.isArray(products) &&
    products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleCreateProduct = () => {
    navigate(`/configuracoes/produtos/novo-produto`);
  };

  return (
    <>
      <Header title="Produtos" />
      <Container>
        <StyledTextField
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
            <StyledButton onClick={handleCreateProduct}>CRIAR NOVO PRODUTO</StyledButton>
          </Grid>
          {filteredProducts &&
            filteredProducts.map((product) => (
              <Grid item key={product.id} xs={12} md={6} lg={4}>
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
                      {product.name.toUpperCase()}
                    </Typography>
                    <Typography variant="body1" style={{ maxWidth: '270px' }}>
                      {product.description}
                    </Typography>
                    <Typography variant="body1" style={{ color: 'green', fontSize: '12px' }}>
                      {`R$${product.price.replace('.', ',')}`}
                    </Typography>
                  </div>
                  <div>
                    <IconButton onClick={() => handleEditClick(product.id)}>
                      <Edit style={{ color: 'white' }} />
                    </IconButton>
                    <IconButton onClick={() => handleToggleProductStatus(product.id)}>
                      {product.disable ? (
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
            Tem certeza de que deseja alterar o status deste produto?
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

export default ListProducts;
