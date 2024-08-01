// LoginUser.js
import React, { useState } from 'react';
import UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/actions/authActions';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UserService.loginUser({ email, password });
      const { token, email: userEmail, username, roles, UserID } = response.data;
      dispatch(login(token, userEmail, username, roles, UserID));

      alert('Đăng nhập thành công');
      navigate('/');
    } catch (error) {
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
    }
  };

  return (
    <div>
      <h2>Đăng nhập người dùng</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div>
          <label>Mật khẩu</label>
          <input 
            type="password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
      <button onClick={() => setForgotPasswordOpen(true)}>Quên mật khẩu?</button>

      <ForgotPassword open={forgotPasswordOpen} handleClose={() => setForgotPasswordOpen(false)} />
      <ResetPassword open={resetPasswordOpen} handleClose={() => setResetPasswordOpen(false)} />
    </div>
  );
};

export default LoginUser;
