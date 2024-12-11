import React, { useState } from 'react';
import UserService from '../../services/UserService';
import './AddUser.css';
import showGeneralToast from '../toastUtils/showGeneralToast'; 
const AddUser = ({ onClose, fetchUsers }) => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    roles: 'USER'
  });
  const [error, setError] = useState(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UserService.registerUser(user);
      showGeneralToast('Người dùng đã được đăng ký thành công!', 'success');
      onClose();
      fetchUsers(); 
    } catch (error) {
      console.error('Error registering user:', error);

      if (error.response && error.response.data) {
        const { message } = error.response.data;
        showGeneralToast(message, 'error');
      } else {
        showGeneralToast('Đã xảy ra lỗi khi đăng ký người dùng', 'error');
      }
    }
  };

  return (
    <div className="add-user-modal-container">
      <div className="add-user-modal-content">
        <h2 className="add-user-modal-header">Đăng Ký Người Dùng</h2>
        <form className="add-user-modal-form" onSubmit={handleSubmit}>
          <div className="add-user-modal-form-group">
            <label className="add-user-modal-label">Tên người dùng</label>
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
            <label className="add-user-modal-label">Mật khẩu</label>
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
            <label className="add-user-modal-label">Họ</label>
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
            <label className="add-user-modal-label">Tên</label>
            <input
              type="text"
              className="add-user-modal-input"
              name="lastName"
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-user-modal-form-group">
            <label className="add-user-modal-label">Số điện thoại</label>
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
            <label className="add-user-modal-label">Vai trò</label>
            <select
              className="add-user-modal-input"
              name="roles"
              value={user.roles}
              onChange={handleChange}
              required
            >
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
          </div>
          <div className="add-user-modal-buttons">
            <button type="submit" className="add-user-modal-btn add-user-modal-btn-primary">Đăng ký</button>
            <button type="button" onClick={onClose} className="add-user-modal-btn add-user-modal-btn-secondary">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
