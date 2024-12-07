import React, { useState } from 'react';
import UserService from '../../services/UserService';
import './RegisterUser.css';
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast

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

  const [error, setError] = useState(null); // State để lưu lỗi

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gọi API để đăng ký người dùng
      await UserService.registerUser(user);
  
      // Hiển thị thông báo thành công
      showGeneralToast('Đăng ký thành công! Chào mừng bạn đến với GreenHome!', 'success');
      
      // Reset form sau khi đăng ký thành công
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
  
      // Hiển thị thông báo lỗi
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        showGeneralToast(message, 'error');
      } else {
        showGeneralToast('Đã xảy ra lỗi khi đăng ký người dùng. Vui lòng thử lại.', 'error');
      }
    }
  };

  return (
    <div className="register-user-page-container">
      <div className="register-user-page-content">
        <h2 className="register-user-page-header">Tham gia GreenHome Ngay Hôm Nay</h2>

        <form className="register-user-page-form" onSubmit={handleSubmit}>
          <div className="register-user-page-grid">
            <div className="register-user-page-column">
              <div className="register-user-page-form-group">
                <label className="register-user-page-label">Tên người dùng</label>
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
                <label className="register-user-page-label">Tên</label>
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
                <label className="register-user-page-label">Họ</label>
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
                <label className="register-user-page-label">Mật khẩu</label>
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
                <label className="register-user-page-label">Số điện thoại</label>
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
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
