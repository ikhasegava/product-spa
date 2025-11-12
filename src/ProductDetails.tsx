import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from './store';
import Header from './Header';
import {
  Card, CardMedia, CardContent, Typography, Button, Container,
  Box, IconButton, CircularProgress, TextField, Alert, Dialog,
  DialogActions, DialogContent, DialogTitle, Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    products, 
    fetchProducts, 
    updateProduct,
    addToCart // добавлена функция добавления в корзину
  } = useProductStore();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const product = products.find(p => p.id === Number(id));

  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      if (products.length === 0) {
        await fetchProducts();
      }
      setLoading(false);
    };

    loadProduct();
  }, [fetchProducts, products.length]);

  useEffect(() => {
    if (product) {
      setEditFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        image: product.image
      });
    }
  }, [product]);

  const handleEditClick = () => {
    setEditDialogOpen(true);
    setError('');
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    if (product) {
      setEditFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        image: product.image
      });
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      if (!product) {
        throw new Error('Товар не найден');
      }

      if (!editFormData.title.trim() || !editFormData.description.trim() || !editFormData.price || !editFormData.image.trim()) {
        throw new Error('Все поля обязательны для заполнения');
      }

      const price = parseFloat(editFormData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Цена должна быть положительным числом');
      }

      await updateProduct(product.id, {
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        price: price,
        image: editFormData.image.trim()
      });

      setEditDialogOpen(false);
      showSnackbar('Товар успешно обновлен!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  // Функция добавления товара в корзину
  const handleAddToCart = () => {
    if (product) {
      // Добавляем товар указанное количество раз
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      showSnackbar(`Товар "${product.title}" добавлен в корзину в количестве ${quantity} шт.!`);
      // Сбрасываем количество после добавления
      setQuantity(1);
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container className="product-details-container">
          <div className="loading-container">
            <CircularProgress size={60} thickness={5} />
          </div>
        </Container>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <Container className="product-details-container">
          <Typography variant="h5" gutterBottom>
            Товар не найден
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Извините, запрашиваемый товар не существует или был удален.
          </Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/products')}
            className="product-details-back-btn"
            sx={{ mt: 2 }}
          >
            Вернуться к каталогу
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="product-details-container">
        <Box className="product-details-header">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/products')}
            className="product-details-back-btn"
          >
            К списку
          </Button>

          <Button
            startIcon={<EditIcon />}
            onClick={handleEditClick}
            variant="outlined"
            className="product-details-edit-btn"
          >
            Редактировать
          </Button>
        </Box>

        <Card className="product-details-card">
          <Box className="product-details-layout">
            <Box className="product-details-image-section">
              <CardMedia
                component="img"
                image={product.image}
                alt={product.title}
                className="product-details-image"
              />
            </Box>

            <Box className="product-details-info-section">
              <CardContent sx={{ p: 0 }}>
                <Typography className="product-details-title">
                  {product.title}
                </Typography>
                
                <Typography variant="body2" color="primary" sx={{ 
                  mb: 2, 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  fontSize: '0.75rem' 
                }}>
                  {product.category}
                </Typography>
                
                <Typography className="product-details-price">
                  {formatPrice(product.price)}
                </Typography>

                <Box className="product-details-quantity-section">
                  <Box className="product-details-quantity-controls">
                    <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
                      Количество:
                    </Typography>
                    <IconButton 
                      className="product-details-quantity-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography className="product-details-quantity-display">
                      {quantity}
                    </Typography>
                    <IconButton 
                      className="product-details-quantity-btn"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  
                  <Button
                    variant="contained"
                    className="product-details-buy-btn"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={handleAddToCart}
                    sx={{
                      backgroundColor: '#10b981',
                      '&:hover': {
                        backgroundColor: '#059669'
                      }
                    }}
                  >
                    Добавить в корзину
                  </Button>
                </Box>

                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Описание товара
                  </Typography>
                  <Typography className="product-details-description">
                    {product.description}
                  </Typography>
                </Box>

                <Button 
                  variant="text" 
                  className="product-details-more-info-btn"
                >
                  Ознакомиться подробнее с составом
                </Button>
              </CardContent>
            </Box>
          </Box>
        </Card>

        <Dialog 
          open={editDialogOpen} 
          onClose={handleEditClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle className="edit-dialog-title">
            Редактировать товар
            <IconButton onClick={handleEditClose} className="edit-dialog-close-btn">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent className="edit-dialog-content">
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="Название товара"
                name="title"
                value={editFormData.title}
                onChange={handleEditChange}
                margin="normal"
                required
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Описание"
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                margin="normal"
                required
                multiline
                rows={4}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Цена (руб)"
                name="price"
                type="number"
                value={editFormData.price}
                onChange={handleEditChange}
                margin="normal"
                required
                variant="outlined"
                inputProps={{ min: 0, step: 1 }}
              />
              
              <TextField
                fullWidth
                label="URL изображения"
                name="image"
                value={editFormData.image}
                onChange={handleEditChange}
                margin="normal"
                required
                variant="outlined"
              />
            </Box>
          </DialogContent>
          
          <DialogActions className="edit-dialog-actions">
            <Button 
              onClick={handleEditClose}
              variant="outlined"
              className="edit-dialog-cancel-btn"
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSave}
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={saving}
              className="edit-dialog-save-btn"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar для уведомлений */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              backgroundColor: '#10b981',
              color: 'white',
              fontWeight: 600
            }
          }}
        />
      </Container>
    </>
  );
};

export default ProductDetails;