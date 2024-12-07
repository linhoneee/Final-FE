import toast from 'react-hot-toast';

const showGeneralToast = (message, type = 'info') => {
  const toastStyles = {
    info: {
      icon: 'ℹ️',
      style: {
        background: '#e0f7fa',
        color: '#00796b',
      },
    },
    success: {
      icon: '✅',
      style: {
        background: '#e8f5e9',
        color: '#388e3c',
      },
    },
    error: {
      icon: '❌',
      style: {
        background: '#ffebee',
        color: '#d32f2f',
      },
    },
    warning: {
      icon: '⚠️',
      style: {
        background: '#fff8e1',
        color: '#f57c00',
      },
    },
  };

  const toastConfig = toastStyles[type] || toastStyles.info;

  toast(
    message,
    {
      icon: toastConfig.icon,
      style: {
        borderRadius: '8px',
        padding: '12px 16px',
        ...toastConfig.style,
      },
      duration: 5000, // Toast sẽ hiển thị trong 5 giây
      position: "top-center" // Hiển thị ở đầu trang, giữa
    }
  );
};

export default showGeneralToast;
