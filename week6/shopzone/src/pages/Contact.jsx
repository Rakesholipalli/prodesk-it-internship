import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Check } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Have questions? We'd love to hear from you!</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">
              <MapPin size={40} />
            </div>
            <h3>Address</h3>
            <p>123 Shopping Street</p>
            <p>New York, NY 10001</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <Mail size={40} />
            </div>
            <h3>Email</h3>
            <p>support@shopzone.com</p>
            <p>sales@shopzone.com</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <Phone size={40} />
            </div>
            <h3>Phone</h3>
            <p>+1 (555) 123-4567</p>
            <p>Mon-Fri: 9AM - 6PM</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <Clock size={40} />
            </div>
            <h3>Business Hours</h3>
            <p>Monday - Friday: 9AM - 6PM</p>
            <p>Saturday: 10AM - 4PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send us a Message</h2>
          
          {submitted && (
            <div className="success-message">
              <Check size={20} /> Thank you! Your message has been sent successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is this about?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Tell us more..."
              />
            </div>

            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
