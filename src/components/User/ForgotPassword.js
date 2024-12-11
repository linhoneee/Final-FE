import React, { useState, useEffect } from 'react';
import UserService from '../../services/UserService';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import './ForgotPassword.css'; // Import file CSS
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast

const ForgotPassword = ({ open, handleClose, handleOpenResetPassword, initialEmail }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail); 
    }
  }, [initialEmail]);

 
  const sendOtp = async (emailToSend) => {
    setLoading(true);
    try {
      const response = await UserService.checkEmailExists(emailToSend);
      if (!response.data.exists) {
        showGeneralToast('Email không tồn tại trong hệ thống', 'error'); 
        setLoading(false);
        return;
      }
  
      await UserService.sendOtp(emailToSend);
      showGeneralToast('OTP đã được gửi tới email của bạn', 'success'); 
      handleClose(); 
      handleOpenResetPassword(emailToSend);
    } catch (error) {
      showGeneralToast('Gửi OTP thất bại', 'error'); 
      console.error('Lỗi gửi OTP:', error);
    } finally {
      setLoading(false); 
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      sendOtp(email); 
    }
  };

  return (
    <Modal open={open} onClose={handleClose} className="geenhome-modal">
      <Box className={`modalBox ${loading ? 'loading-overlay' : ''}`}>
        <Typography variant="h6" className="modalTitle">Quên mật khẩu</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            disabled={!!initialEmail} // !! để chuyển đổi giá trị thành true hoặc false, giúp kiểm tra điều kiện
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="modalButton"
            disabled={loading} 
          >
            {loading ? <CircularProgress size={24} className="loading-spinner" /> : 'Gửi OTP'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ForgotPassword;
