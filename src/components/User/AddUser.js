import React, { useState } from 'react';
import UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import './AddUser.css';

const AddUser = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    roles: 'USER'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UserService.registerUser(user);
      alert('User registered successfully');
      navigate('/userList');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Failed to register user');
    }
  };

  return (
    <div className="add-user-modal-container">
      <div className="add-user-modal-content">
        <h2 className="add-user-modal-header">Register User</h2>
        <form className="add-user-modal-form" onSubmit={handleSubmit}>
          <div className="add-user-modal-form-group">
            <label className="add-user-modal-label">Username</label>
            <input
              type="text"
              className="add-user-modal-input"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-user-modal-form-group">
            <label className="add-user-modal-label">Email</label>
            <input
              type="email"
              className="add-user-modal-input"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-user-modal-form-group">
            <label className="add-user-modal-label">Password</label>
            <input
              type="password"
              className="add-user-modal-input"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-user-modal-form-group">
            <label className="add-user-modal-label">First Name</label>
            <input
              type="text"
              className="add-user-modal-input"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-user-modal-form-group">
            <label className="add-user-modal-label">Last Name</label>
            <input
              type="text"
              className="add-user-modal-input"
              name="lastName"
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-user-modal-form-group">
            <label className="add-user-modal-label">Phone Number</label>
            <input
              type="text"
              className="add-user-modal-input"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-user-modal-form-group">
            <label className="add-user-modal-label">Roles</label>
            <input
              type="text"
              className="add-user-modal-input"
              name="roles"
              value={user.roles}
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-user-modal-buttons">
            <button type="submit" className="add-user-modal-btn add-user-modal-btn-primary">Register</button>
            <button type="button" onClick={() => navigate('/userList')} className="add-user-modal-btn add-user-modal-btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
