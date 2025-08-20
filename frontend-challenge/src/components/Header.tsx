import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import CartSidebar from './CartSidebar';
import './Header.css';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();

  return (
    <>
      <header className="header">
        <div className="header-content">
          <a href="/" className="logo">
            <div className="logo-icon">
              <span className="material-icons">store</span>
            </div>
            <span className="logo-text">PromoShop</span>
          </a>

          <nav className="nav">
            <a href="/" className="nav-link active">
              <span className="material-icons">home</span>
              Inicio
            </a>
            <a href="/products" className="nav-link">
              <span className="material-icons">category</span>
              Productos
            </a>
            <a href="/about" className="nav-link">
              <span className="material-icons">info</span>
              Nosotros
            </a>
            <a href="/contact" className="nav-link">
              <span className="material-icons">contact_support</span>
              Contacto
            </a>
          </nav>

          <div className="header-actions">
            <div className="header-search">
              <span className="material-icons">search</span>
              <input type="text" placeholder="Buscar productos..." />
            </div>
            
            <button 
              className="action-btn cart-btn"
              onClick={() => setIsCartOpen(true)}
            >
              <span className="material-icons">shopping_cart</span>
              <span>Carrito</span>
              {cart.itemCount > 0 && (
                <span className="cart-badge">{cart.itemCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;