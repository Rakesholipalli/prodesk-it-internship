import React from 'react';
import { CheckCircle } from 'lucide-react';
import './SuccessScreen.css';

const SuccessScreen = ({ formData, onGoToLogin }) => {
  // Format date to be more user-friendly
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="success-container">
      <div className="success-icon">
        <CheckCircle size={48} strokeWidth={2.5} />
      </div>
      <h1 className="success-title">Registration Successful!</h1>
      <p className="success-message">
        Your account has been created successfully. Please login to continue.
      </p>
      
      <div className="success-details">
        <h3>Account Summary</h3>
        <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Date of Birth:</strong> {formatDate(formData.dateOfBirth)}</p>
      </div>

      <button 
        type="button" 
        className="btn-success" 
        onClick={onGoToLogin}
      >
        Go to Login
      </button>
    </div>
  );
};

export default SuccessScreen;
