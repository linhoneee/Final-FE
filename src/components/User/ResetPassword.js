import React, { useState } from 'react';
import UserService from '../../services/UserService';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import '../../Css/ModalResetPass.css';

const ResetPassword = ({ open, handleClose }) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await UserService.verifyOtp(email, otp);
      if (response.status === 200) {
        alert('OTP hợp lệ. Bạn có thể đặt lại mật khẩu mới.');
        setOtpVerified(true);
      } else {
        alert('OTP không hợp lệ');
      }
    } catch (error) {
      alert('OTP không hợp lệ');
      console.error('Lỗi xác nhận OTP:', error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await UserService.resetPassword(email, newPassword);
      alert('Đặt lại mật khẩu thành công');
      navigate('/login');
      handleClose();
    } catch (error) {
      alert('Đặt lại mật khẩu thất bại');
      console.error('Lỗi đặt lại mật khẩu:', error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modalBox">
        <Typography variant="h6" className="modalTitle">Đặt lại mật khẩu</Typography>
        {!otpVerified ? (
          <form onSubmit={handleVerifyOtp}>
            <TextField
              label="OTP"
              type="text"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" className="modalButton">
              Xác nhận OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <TextField
              label="Mật khẩu mới"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" className="modalButton">
              Đặt lại mật khẩu
            </Button>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default ResetPassword;
