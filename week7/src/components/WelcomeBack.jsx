import React from 'react';
import { UserCircle, Mail, Calendar, LogOut } from 'lucide-react';
import './WelcomeBack.css';

const WelcomeBack = ({ user, onLogout }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="app-container">
      <div className="welcome-card">
        <div className="welcome-header">
          <div className="user-avatar">
            <UserCircle size={80} strokeWidth={1.5} />
          </div>
          <h1 className="welcome-title">{getGreeting()}, {user.firstName}!</h1>
          <p className="welcome-subtitle">Welcome back to your account</p>
        </div>

        <div className="user-info-card">
          <h3 className="info-card-title">Your Profile</h3>
          
          <div className="info-item">
            <div className="info-icon">
              <UserCircle size={20} />
            </div>
            <div className="info-content">
              <span className="info-label">Full Name</span>
              <span className="info-value">{user.firstName} {user.lastName}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <Mail size={20} />
            </div>
            <div className="info-content">
              <span className="info-label">Email Address</span>
              <span className="info-value">{user.email}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <Calendar size={20} />
            </div>
            <div className="info-content">
              <span className="info-label">Date of Birth</span>
              <span className="info-value">{formatDate(user.dateOfBirth)}</span>
            </div>
          </div>
        </div>

        <div className="welcome-actions">
          <button 
            type="button" 
            className="btn-logout"
            onClick={onLogout}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="welcome-footer">
          <p>Last login: {new Date().toLocaleString('en-US', { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
          })}</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBack;
