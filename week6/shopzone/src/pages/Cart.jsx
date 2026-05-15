import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <ShoppingCart size={80} strokeWidth={1.5} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/shop" className="shop-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button onClick={clearCart} className="clear-cart-button">
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="cart-item-image"
              />
              
              <div className="cart-item-details">
                <Link to={`/product/${item.id}`} className="cart-item-title">
                  {item.title}
                </Link>
                <p className="cart-item-category">{item.category}</p>
                <p className="cart-item-price">${item.price}</p>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-button"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-button"
                  title="Remove from cart"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping:</span>
            <span className="free">FREE</span>
          </div>
          
          <div className="summary-row">
            <span>Tax (estimated):</span>
            <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row total">
            <span>Total:</span>
            <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="checkout-button">
            Proceed to Checkout
          </Link>
          
          <Link to="/shop" className="continue-shopping">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
