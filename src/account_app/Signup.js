import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../Variable';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post(`${baseUrl}/signup/`, formData);
      setSuccessMessage('Signup successful! You can now log in.');
      setFormData({ email: '', password: '' });
    } catch (error) {
      const errorMsg = error.response?.data?.email?.[0] || 'Signup failed. Please try again.';
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-card shadow-lg">
        <h2 className="text-center mb-4">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              placeholder="Enter a secure password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Signup
            </button>
          </div>
        </form>
        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
