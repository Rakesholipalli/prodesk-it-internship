import React from 'react';
import './StepForm.css';

const StepOne = ({ register, errors }) => {
  return (
    <div className="step-container">
      <h2 className="step-title">Personal Information</h2>
      <p className="step-description">Let's start with your basic details</p>

      <div className="form-group">
        <label htmlFor="firstName">First Name *</label>
        <input
          id="firstName"
          type="text"
          className={errors.firstName ? 'input-error' : ''}
          placeholder="Enter your first name"
          {...register('firstName')}
        />
        {errors.firstName && (
          <span className="error-message">{errors.firstName.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name *</label>
        <input
          id="lastName"
          type="text"
          className={errors.lastName ? 'input-error' : ''}
          placeholder="Enter your last name"
          {...register('lastName')}
        />
        {errors.lastName && (
          <span className="error-message">{errors.lastName.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="dateOfBirth">Date of Birth *</label>
        <input
          id="dateOfBirth"
          type="date"
          className={errors.dateOfBirth ? 'input-error' : ''}
          {...register('dateOfBirth')}
        />
        {errors.dateOfBirth && (
          <span className="error-message">{errors.dateOfBirth.message}</span>
        )}
      </div>
    </div>
  );
};

export default StepOne;
