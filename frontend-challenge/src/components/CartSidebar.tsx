import React from 'react';
import { useCart } from '../contexts/CartContext';
import './CartSidebar.css';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2 className="cart-title">Carrito de Compras</h2>
          <button className="cart-close" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="cart-content">
          {cart.items.length === 0 ? (
            <div className="cart-empty">
              <span className="material-icons">shopping_cart</span>
              <p>Tu carrito está vacío</p>
              <button className="btn btn-primary" onClick={onClose}>
                Seguir comprando
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map(item => (
                  <div key={item.productId} className="cart-item">
                    <div className="cart-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <span className="material-icons">image</span>
                      )}
                    </div>
                    
                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <p className="cart-item-sku">SKU: {item.sku}</p>
                      <p className="cart-item-price">{formatPrice(item.price)} c/u</p>
                    </div>
                    
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="remove-btn"
                        title="Eliminar producto"
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">{formatPrice(cart.total)}</span>
                </div>
                
                <div className="cart-actions">
                  <button className="btn btn-secondary" onClick={clearCart}>
                    Vaciar carrito
                  </button>
                  <button className="btn btn-primary">
                    Proceder al pago
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;