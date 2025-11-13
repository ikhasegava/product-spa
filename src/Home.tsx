import React from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Header from './Header';

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-background-overlay"></div>
        <div className="home-content">
          <h1 className="home-title">
            <span>Добро пожаловать в королевство</span> Вкусняшка
          </h1>
          
          <p className="home-subtitle">
            Лучший выбор мармеладок по отличным ценам. 
            Находите то, что вашим вкусовым сосочкам понравится.
          </p>

          <Link to="/products" className="home-cta-button">
            <ShoppingCartIcon className="cta-icon" />
            Перейти к товарам
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;