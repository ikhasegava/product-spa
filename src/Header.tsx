import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import StoreIcon from '@mui/icons-material/Store';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  TextField, IconButton, Box, Badge, Popover, Typography,
  Button, Divider, List, ListItem, ListItemText, ListItemAvatar,
  Avatar, ListItemSecondaryAction
} from '@mui/material';
import { useProductStore } from './store';

const Header: React.FC = () => {
  const location = useLocation();
  const { 
    searchQuery, 
    setSearchQuery,
    cart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  } = useProductStore();

  const [cartAnchorEl, setCartAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleCartClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const cartOpen = Boolean(cartAnchorEl);
  const cartId = cartOpen ? 'cart-popover' : undefined;

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <StoreIcon className="logo-icon" />
          <Link to="/" className="logo-text">
            Вкусняшка
          </Link>
        </div>

        <Box className="search-section">
          <TextField
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
            className="search-field"
            InputProps={{
              startAdornment: <SearchIcon className="search-icon" />,
              endAdornment: searchQuery && (
                <IconButton 
                  size="small" 
                  onClick={handleClearSearch}
                  className="clear-search-btn"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )
            }}
          />
        </Box>

        <nav className="nav-section">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}
          >
            Главная
          </Link>
          <Link 
            to="/products" 
            className={`nav-link ${location.pathname === '/products' ? 'nav-link-active' : ''}`}
          >
            Товары
          </Link>
          
          <IconButton 
            onClick={handleCartClick}
            className="cart-btn"
          >
            <Badge 
              badgeContent={getCartItemsCount()} 
              color="primary"
              className="cart-badge"
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </nav>

        <Popover
          id={cartId}
          open={cartOpen}
          anchorEl={cartAnchorEl}
          onClose={handleCartClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          className="cart-popover"
        >
          <Box className="cart-popover-content">
            <Typography variant="h6" gutterBottom className="cart-title">
              Корзина
              {cart.length > 0 && (
                <Button 
                  size="small" 
                  onClick={clearCart}
                  className="clear-cart-btn"
                >
                  Очистить
                </Button>
              )}
            </Typography>

            {cart.length === 0 ? (
              <Box className="empty-cart">
                <ShoppingCartIcon className="empty-cart-icon" />
                <Typography variant="body1" className="empty-cart-text">
                  Корзина пуста
                </Typography>
              </Box>
            ) : (
              <>
                <List className="cart-list">
                  {cart.map((item) => (
                    <ListItem key={item.product.id} alignItems="flex-start" className="cart-item">
                      <ListItemAvatar>
                        <Avatar 
                          src={item.product.image} 
                          alt={item.product.title}
                          variant="rounded"
                          className="cart-item-image"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" className="cart-item-title">
                            {item.product.title}
                          </Typography>
                        }
                        secondary={
                          <Box className="cart-item-details">
                            <Typography variant="body2" className="cart-item-price">
                              {formatPrice(item.product.price)}
                            </Typography>
                            <Box className="quantity-controls">
                              <IconButton 
                                size="small" 
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                className="quantity-btn"
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography variant="body2" className="quantity-display">
                                {item.quantity}
                              </Typography>
                              <IconButton 
                                size="small" 
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                className="quantity-btn"
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleRemoveFromCart(item.product.id)}
                          className="remove-from-cart-btn"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>

                <Divider className="cart-divider" />

                <Box className="cart-total">
                  <Typography variant="h6" className="total-label">
                    Итого:
                  </Typography>
                  <Typography variant="h6" className="total-price">
                    {formatPrice(getCartTotal())}
                  </Typography>
                </Box>

                <Button 
                  variant="contained" 
                  fullWidth
                  className="checkout-btn"
                >
                  Оформить заказ
                </Button>
              </>
            )}
          </Box>
        </Popover>
      </div>
    </header>
  );
};

export default Header;