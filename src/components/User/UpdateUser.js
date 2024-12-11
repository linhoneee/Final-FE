import React, { useState, useEffect } from 'react';
import UserService from '../../services/UserService';
import './UpdateUser.css';
import showGeneralToast from '../toastUtils/showGeneralToast'; 

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
      
      showGeneralToast("Người dùng đã được cập nhật thành công!", "success");
      
      onUpdate();
      
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        showGeneralToast(message, "error");
      } else {
        showGeneralToast("Có lỗi xảy ra khi cập nhật người dùng", "error");
      }
    }
  };
  

  return (
    <div className="update-user-modal-container">
      <div className="update-user-modal-content">
        <h2 className="update-user-modal-header">Cập nhật người dùng</h2>
        <form className="update-user-modal-form" onSubmit={handleSubmit}>
          <div className="update-user-modal-form-group">
            <label className="update-user-modal-label">Tên người dùng</label>
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
            <label className="update-user-modal-label">Số điện thoại</label>
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
            <label className="update-user-modal-label">Quyền</label>
            <select
              className="update-user-modal-input"
              name="roles"
              value={updatedUser?.roles || ''}
              onChange={handleChange}
              required
            >
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
          </div>
          <div className="update-user-modal-buttons">
            <button type="submit" className="update-user-modal-btn update-user-modal-btn-primary">
              Lưu thay đổi
            </button>
            <button
              type="button"
              onClick={onClose}
              className="update-user-modal-btn update-user-modal-btn-secondary"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default UpdateUser;
