import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import AddressList from '../Address/AddressList'; // Import AddressList
import './UserDetails.css'; // Import the combined CSS file
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [picture, setPicture] = useState(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  
  // Fetch user details
  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await UserService.getUserById(id);
      setUser(response.data);
      console.log("USER:",response.data );
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const updateUserDetails = async (e) => {
    e.preventDefault(); 
    try {
      await UserService.updateUser(user, id);
      if (picture) {
        await UserService.updateUserPicture(id, picture);
      }
    } catch (error) {
      console.error('Failed to update user details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'day' || name === 'month' || name === 'year') {
      const date = new Date(user.birthday || new Date());
      if (name === 'day') date.setDate(value);
      if (name === 'month') date.setMonth(value - 1);
      if (name === 'year') date.setFullYear(value);
      setUser({ ...user, birthday: date.toISOString() });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPicture(selectedFile); // Lưu tạm hình ảnh để hiển thị
      try {
        await UserService.updateUserPicture(id, selectedFile); // Gọi API ngay khi chọn ảnh
        fetchUserDetails(); // Làm mới thông tin người dùng
        showGeneralToast('Chỉnh sửa ảnh thành công!', 'success');
      } catch (error) {
        console.error('Failed to update picture:', error);
        showGeneralToast('Đã xảy ra lỗi khi chỉnh sửa ảnh!', 'error');
      }
    }
  };

  const handleGenderChange = (e) => {
    setUser({ ...user, genderId: parseInt(e.target.value) });
  };

  const handleOpenResetPassword = (email) => {
    setResetPasswordEmail(email);
    setResetPasswordOpen(true);
  };

  return (
    <div className="user-details-container">
      <h2>Chi tiết người dùng</h2>
      <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      <form onSubmit={updateUserDetails} className="user-details-form">
        <div className="left-section">
          <div className="form-group">
            <label>Tên người dùng</label>
            <input
              type="text"
              name="username"
              value={user.username || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Tên</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={user.email || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={user.phoneNumber || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Giới tính</label>
            <div className="gender-options">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="0"
                  checked={user.genderId === 0}
                  onChange={handleGenderChange}
                />
                Nam
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="1"
                  checked={user.genderId === 1}
                  onChange={handleGenderChange}
                />
                Nữ
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="2"
                  checked={user.genderId === 2}
                  onChange={handleGenderChange}
                />
                Khác
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Ngày sinh</label>
            <div className="birthday-options">
              <select name="day" value={user.birthday ? new Date(user.birthday).getDate() : ''} onChange={handleInputChange}>
                {[...Array(31).keys()].map(day => <option key={day + 1} value={day + 1}>{day + 1}</option>)}
              </select>
              <select name="month" value={user.birthday ? new Date(user.birthday).getMonth() + 1 : ''} onChange={handleInputChange}>
                {[...Array(12).keys()].map(month => <option key={month + 1} value={month + 1}>Tháng {month + 1}</option>)}
              </select>
              <select name="year" value={user.birthday ? new Date(user.birthday).getFullYear() : ''} onChange={handleInputChange}>
                {[...Array(100).keys()].map(year => <option key={1920 + year} value={1920 + year}>{1920 + year}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="update-button">Lưu</button>
        </div>
        <div className="form-group">
          <label>Ảnh hồ sơ</label>
          {user.picture && (
            <div className="user-picture">
              <img src={`http://localhost:8080${user.picture}`} alt="User" />
            </div>
          )}
          <input
            type="file"
            id="file-input"
            style={{ display: 'none' }}
            onChange={handleFileChange} // Gọi hàm ngay khi người dùng chọn ảnh
          />
          <button
            type="button"
            className="upload-button"
            onClick={() => document.getElementById('file-input').click()}
          >
            Chọn Ảnh
          </button>
          <label className="forgot-password-label" onClick={() => setForgotPasswordOpen(true)}>Quên mật khẩu?</label>
        </div>
      </form>

      {/* Address List Section */}
      <div className="address-list-section">
        <AddressList /> {/* Render AddressList component here */}
      </div>

      <div>
        <ForgotPassword 
          open={forgotPasswordOpen} 
          handleClose={() => setForgotPasswordOpen(false)} 
          handleOpenResetPassword={handleOpenResetPassword} 
          initialEmail={user.email} // Truyền email từ thông tin người dùng
        />

        <ResetPassword 
          open={resetPasswordOpen} 
          handleClose={() => setResetPasswordOpen(false)} 
          email={resetPasswordEmail} 
        />
      </div>
    </div>
  );
};

export default UserDetails;
