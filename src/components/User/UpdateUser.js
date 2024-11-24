import React, { useState, useEffect } from 'react';
import UserService from '../../services/UserService';
import './UpdateUser.css';

const UpdateUser = ({ user, onClose, onUpdate }) => {
  const [updatedUser, setUpdatedUser] = useState(user);

  useEffect(() => {
    setUpdatedUser(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UserService.updateUser(updatedUser, updatedUser.id);
      alert('User updated successfully!');
      onUpdate(); // Refresh the user list after update
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user.');
    }
  };

  return (
    <div className="update-user-modal-container">
      <div className="update-user-modal-content">
        <h2 className="update-user-modal-header">Update User</h2>
        <form className="update-user-modal-form" onSubmit={handleSubmit}>
          <div className="update-user-modal-form-group">
            <label className="update-user-modal-label">Username</label>
            <input
              type="text"
              className="update-user-modal-input"
              name="username"
              value={updatedUser?.username || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="update-user-modal-form-group">
            <label className="update-user-modal-label">Email</label>
            <input
              type="email"
              className="update-user-modal-input"
              name="email"
              value={updatedUser?.email || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="update-user-modal-form-group">
            <label className="update-user-modal-label">Phone Number</label>
            <input
              type="text"
              className="update-user-modal-input"
              name="phoneNumber"
              value={updatedUser?.phoneNumber || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="update-user-modal-form-group">
            <label className="update-user-modal-label">Roles</label>
            <select
              className="update-user-modal-input"
              name="roles"
              value={updatedUser?.roles || ''}
              onChange={handleChange}
              required
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="update-user-modal-buttons">
            <button type="submit" className="update-user-modal-btn update-user-modal-btn-primary">
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="update-user-modal-btn update-user-modal-btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
