import React, { useState } from 'react';
import UserService from '../../services/UserService';
// import { useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const ForgotPassword = ({ open, handleClose, handleOpenResetPassword }) => {
  const [email, setEmail] = useState('');
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UserService.checkEmailExists(email);
      if (!response.data.exists) {
        alert('Email không tồn tại trong hệ thống');
        return;
      }
      await UserService.sendOtp(email);
      alert('OTP đã được gửi tới email của bạn');
      handleClose();
      handleOpenResetPassword(email);
    } catch (error) {
      alert('Gửi OTP thất bại');
      console.error('Lỗi gửi OTP:', error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modalBox">
        <Typography variant="h6" className="modalTitle">Quên mật khẩu</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" className="modalButton">
            Gửi OTP
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ForgotPassword;
