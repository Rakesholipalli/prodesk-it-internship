import React from 'react';
import './StepForm.css';

const StepThree = ({ formData }) => {
  // Format date to be more user-friendly
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="step-container">
      <h2 className="step-title">Review & Submit</h2>
      <p className="step-description">Please verify your information before submitting</p>

      <div className="review-section">
        <h3 className="review-section-title">Personal Information</h3>
        <div className="review-item">
          <span className="review-label">First Name:</span>
          <span className="review-value">{formData.firstName}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Last Name:</span>
          <span className="review-value">{formData.lastName}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Date of Birth:</span>
          <span className="review-value">{formatDate(formData.dateOfBirth)}</span>
        </div>
      </div>

      <div className="review-section">
        <h3 className="review-section-title">Account Details</h3>
        <div className="review-item">
          <span className="review-label">Email:</span>
          <span className="review-value">{formData.email}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Password:</span>
          <span className="review-value">••••••••</span>
        </div>
      </div>

      <div className="info-box">
        <p>
          By submitting this form, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default StepThree;
