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
import { Link } from 'react-router-dom'; // Importe o componente Link para criar o botão "Criar Novo Produto"
import FooterNavigation from '../../components/FooterNavigation/FooterNavigation';
import Header from '../../components/Header/Header';
import { getProducts, updateProductStatus } from '../../service/api'; // Importe as funções necessárias para produtos

function ListProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

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

  const handleEditProduct = (productId) => {
    // Lógica para editar o produto
    console.log('Editar produto com ID:', productId);
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

  return (
    <>
      <Header title="Produtos" />
      <Container>
        <Typography variant="h4" gutterBottom>
          Lista de Produtos
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
            <Link to="/configuracoes/produtos/novo-produto">
              <Button
                variant="contained"
                color="primary"
                fullWidth // Ocupa toda a largura disponível
                style={{ borderRadius: 0 }} // Remove o arredondamento dos cantos
              >
                Criar Novo Produto
              </Button>
            </Link>
          </Grid>
          {filteredProducts &&
            filteredProducts.map((product) => (
              <Grid item key={product.id} xs={12} md={6} lg={4}>
                <div
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body1">{product.description}</Typography>
                  <Typography variant="body1">{`Preço: R$${product.price}`}</Typography>
                  <div style={{ marginTop: 'auto' }}>
                    <IconButton onClick={() => handleToggleProductStatus(product.id)}>
                      {product.disable ? <LockOpen /> : <Lock />}
                    </IconButton>
                    <IconButton onClick={() => handleEditProduct(product.id)}>
                      <Edit />
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
