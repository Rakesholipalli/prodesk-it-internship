import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const totalItems = getTotalItems();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <ShoppingBag size={24} /> ShopZone
        </Link>
        
        <ul className="navbar-menu">
          <li>
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li>
            <Link to="/shop" className="navbar-link">Shop</Link>
          </li>
          <li>
            <Link to="/contact" className="navbar-link">Contact</Link>
          </li>
          <li>
            <Link to="/cart" className="navbar-link cart-link">
              <ShoppingCart size={20} /> Cart
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>
          </li>
          {user ? (
            <>
              <li className="navbar-user">
                <User size={18} /> {user.username}
              </li>
              <li>
                <button onClick={logout} className="navbar-button">
                  <LogOut size={18} /> Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="navbar-button">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
