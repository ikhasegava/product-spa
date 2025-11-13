import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import StoreIcon from '@mui/icons-material/Store';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {
  TextField, IconButton, Box, Badge, Popover, Typography,
  Button, Divider, List, ListItem, ListItemText, ListItemAvatar,
  Avatar, ListItemSecondaryAction, Drawer, useMediaQuery, Theme
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

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

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
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
          <img src="https://ucarecdn.com/0b9c1781-6aab-4908-99ea-3cbb3c46348a/" alt="Вкусняшка" className="logo-image" />
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

        {!isMobile && (
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
        )}

        {isMobile && (
          <div className="mobile-nav-section">
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

            <IconButton 
              onClick={handleMobileMenuToggle}
              className="burger-menu-btn"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </div>
        )}

        <Drawer
          anchor="right"
          open={mobileMenuOpen && isMobile}
          onClose={handleMobileMenuClose}
          className="mobile-menu-drawer"
        >
          <Box className="mobile-menu-content">
            <Box className="mobile-menu-header">
              <Typography variant="h6" className="mobile-menu-title">
                Меню
              </Typography>
              <IconButton 
                onClick={handleMobileMenuClose}
                className="mobile-menu-close-btn"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider className="mobile-menu-divider" />

            <nav className="mobile-nav-links">
              <Link 
                to="/" 
                className={`mobile-nav-link ${location.pathname === '/' ? 'mobile-nav-link-active' : ''}`}
                onClick={handleNavLinkClick}
              >
                Главная
              </Link>
              <Link 
                to="/products" 
                className={`mobile-nav-link ${location.pathname === '/products' ? 'mobile-nav-link-active' : ''}`}
                onClick={handleNavLinkClick}
              >
                Товары
              </Link>
            </nav>

            <Box className="mobile-cart-info">
              <Divider className="mobile-menu-divider" />
              <Box className="mobile-cart-summary">
                <Typography variant="body2" className="mobile-cart-items">
                  Товаров в корзине: {getCartItemsCount()}
                </Typography>
                <Typography variant="h6" className="mobile-cart-total">
                  {formatPrice(getCartTotal())}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Drawer>

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