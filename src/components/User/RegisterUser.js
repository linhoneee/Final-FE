import React, { useState } from 'react';
import UserService from '../../services/UserService';
import './RegisterUser.css';

const RegisterUser = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    roles: 'USER', // Mặc định vai trò là 'USER'
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await UserService.registerUser(user);
      setSuccessMessage('Registration successful! Welcome to GreenHome!');
      setUser({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        roles: 'USER',
      });
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage('Failed to register. Please try again.');
    }
  };

  return (
    <div className="register-user-page-container">
      <div className="register-user-page-content">
        <h2 className="register-user-page-header">Join GreenHome Today</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="register-user-page-form" onSubmit={handleSubmit}>
          <div className="register-user-page-grid">
            <div className="register-user-page-column">
              <div className="register-user-page-form-group">
                <label className="register-user-page-label">Username</label>
                <input
                  type="text"
                  className="register-user-page-input"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="register-user-page-form-group">
                <label className="register-user-page-label">Email</label>
                <input
                  type="email"
                  className="register-user-page-input"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="register-user-page-column">
              <div className="register-user-page-form-group">
                <label className="register-user-page-label">First Name</label>
                <input
                  type="text"
                  className="register-user-page-input"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="register-user-page-form-group">
                <label className="register-user-page-label">Last Name</label>
                <input
                  type="text"
                  className="register-user-page-input"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="register-user-page-column">
              <div className="register-user-page-form-group">
                <label className="register-user-page-label">Password</label>
                <input
                  type="password"
                  className="register-user-page-input"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="register-user-page-form-group">
                <label className="register-user-page-label">Phone Number</label>
                <input
                  type="text"
                  className="register-user-page-input"
                  name="phoneNumber"
                  value={user.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="register-user-page-buttons">
            <button type="submit" className="register-user-page-btn register-user-page-btn-primary">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
