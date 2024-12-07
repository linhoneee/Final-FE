import React, { useState } from 'react';
import UserService from '../../services/UserService';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css'; // Import file CSS
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast

const ResetPassword = ({ open, handleClose, email }) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false); // Trạng thái khi đặt lại mật khẩu thành công
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await UserService.verifyOtp(email, otp);
      if (response.status === 200 && response.data === "OTP hợp lệ") {
        showGeneralToast('OTP hợp lệ. Bạn có thể đặt lại mật khẩu mới.', 'success');
        setOtpVerified(true);
      } else {
        showGeneralToast('OTP không hợp lệ', 'error');
      }
    } catch (error) {
      showGeneralToast('OTP không hợp lệ', 'error');
      console.error('Lỗi xác nhận OTP:', error);
    }
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await UserService.resetPassword(email, newPassword);
      showGeneralToast('Đặt lại mật khẩu thành công', 'success');
      setPasswordReset(true); // Thay đổi trạng thái sau khi đặt lại mật khẩu thành công
    } catch (error) {
      showGeneralToast('Đặt lại mật khẩu thất bại', 'error');
      console.error('Lỗi đặt lại mật khẩu:', error);
    }
  };

  const handleCancel = () => {
    handleClose(); // Đóng modal khi bấm nút "Cancel"
    setOtpVerified(false); // Reset trạng thái khi modal đóng
    setPasswordReset(false); // Reset trạng thái đặt lại mật khẩu
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      disableBackdropClick // Chặn việc đóng modal khi nhấn ra ngoài
      disableEscapeKeyDown // Chặn việc đóng modal khi nhấn phím ESC
    >
      <Box className="reset-password-modal">
        <Typography variant="h6" className="reset-password-modal-title">Đặt lại mật khẩu</Typography>
        
        {!passwordReset ? (
          <>
            {!otpVerified ? (
              <form onSubmit={handleVerifyOtp}>
                <TextField
                  label="OTP"
                  type="text"
                  fullWidth
                  margin="normal"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="reset-password-input"
                />
                <Button type="submit" variant="contained" color="primary" className="reset-password-btn">
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
                  className="reset-password-input"
                />
                <Button type="submit" variant="contained" color="primary" className="reset-password-btn">
                  Đặt lại mật khẩu
                </Button>
              </form>
            )}
          </>
        ) : (
          <div>
            <Typography variant="h6" color="success.main" className="reset-password-success-message">
              Mật khẩu đã được đặt lại thành công!
            </Typography>
            <Button onClick={handleCancel} variant="contained" color="secondary" className="reset-password-btn">
              Đóng
            </Button>
          </div>
        )}
        
        {/* Nút Cancel */}
        {!passwordReset && (
          <Button onClick={handleCancel} variant="outlined" color="secondary" className="reset-password-cancel-btn">
            Hủy
          </Button>
        )}
      </Box>
    </Modal>
  );
};

export default ResetPassword;
