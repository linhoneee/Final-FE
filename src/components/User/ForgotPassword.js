import React, { useState, useEffect } from 'react';
import UserService from '../../services/UserService';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import './ForgotPassword.css'; // Import file CSS
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast

const ForgotPassword = ({ open, handleClose, handleOpenResetPassword, initialEmail }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Sử dụng email ban đầu (initialEmail) mà không cần người dùng nhập lại
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail); // Set email ban đầu từ props
    }
  }, [initialEmail]);

  // Hàm gửi OTP
  const sendOtp = async (emailToSend) => {
    setLoading(true); // Hiển thị vòng tròn tải
    try {
      const response = await UserService.checkEmailExists(emailToSend);
      if (!response.data.exists) {
        showGeneralToast('Email không tồn tại trong hệ thống', 'error'); // Thông báo lỗi
        setLoading(false);
        return;
      }
  
      await UserService.sendOtp(emailToSend);
      showGeneralToast('OTP đã được gửi tới email của bạn', 'success'); // Thông báo thành công
      handleClose(); // Đóng modal sau khi gửi OTP
      handleOpenResetPassword(emailToSend); // Mở modal Reset Password
    } catch (error) {
      showGeneralToast('Gửi OTP thất bại', 'error'); // Thông báo lỗi
      console.error('Lỗi gửi OTP:', error);
    } finally {
      setLoading(false); // Tắt vòng tròn tải dù thành công hay thất bại
    }
  };
  

  // Hàm xử lý submit form khi người dùng nhấn nút gửi OTP
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      sendOtp(email); // Gửi OTP khi người dùng nhấn nút gửi
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
            onChange={(e) => setEmail(e.target.value)} // Cập nhật giá trị email khi người dùng thay đổi
            disabled={!!initialEmail} // Vô hiệu hóa trường nhập nếu có initialEmail
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="modalButton"
            disabled={loading} // Vô hiệu hóa nút khi đang tải
          >
            {loading ? <CircularProgress size={24} className="loading-spinner" /> : 'Gửi OTP'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ForgotPassword;
