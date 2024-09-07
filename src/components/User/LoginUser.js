import React, { useState } from 'react';
import UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/actions/authActions';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import './LoginUser.css'; // Import the specific CSS file

const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UserService.loginUser({ email, password });
      const { token, email: userEmail, username, roles, UserID } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('roles', roles);
      localStorage.setItem('userID', UserID);

      dispatch(login(token, userEmail, username, roles, UserID));

      alert('Đăng nhập thành công');
      navigate('/');
    } catch (error) {
      handleLoginError(error);
    }
  };

  const handleGoogleLogin = () => {
    UserService.loginWithGoogle();
  };

  const handleLoginError = (error) => {
    if (error.response) {
      if (error.response.status === 403 && error.response.data.error === "Tài khoản của bạn đã bị khóa") {
        alert('Tài khoản của bạn đã bị khóa');
      } else if (error.response.status === 401) {
        alert('Sai mật khẩu');
      } else if (error.response.status === 404) {
        alert('Email không tồn tại');
      } else {
        alert('Đăng nhập thất bại');
      }
    } else {
      console.error('Lỗi đăng nhập:', error);
      alert('Đăng nhập thất bại');
    }
  };

  const handleOpenResetPassword = (email) => {
    setResetPasswordEmail(email);
    setResetPasswordOpen(true);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Đăng nhập người dùng</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input 
            type={passwordVisible ? "text" : "password"} 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {passwordVisible ? '👁️' : '👁️‍🗨️'}
          </span>
        </div>
        <button type="submit" className="login-button">Đăng nhập</button>
        <label className="forgot-password-label" onClick={() => setForgotPasswordOpen(true)}>Quên mật khẩu?</label>
      </form>
      <button className="google-login-button" onClick={handleGoogleLogin}>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/300/300221.png" 
          alt="Google icon" 
          className="google-icon" 
        />
        Đăng nhập với Google
      </button>

      <ForgotPassword 
        open={forgotPasswordOpen} 
        handleClose={() => setForgotPasswordOpen(false)} 
        handleOpenResetPassword={handleOpenResetPassword} 
      />
      <ResetPassword 
        open={resetPasswordOpen} 
        handleClose={() => setResetPasswordOpen(false)} 
        email={resetPasswordEmail} 
      />
    </div>
  );
};

export default LoginUser;
