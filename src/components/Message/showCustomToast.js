import toast from 'react-hot-toast';
import { FiMessageCircle } from 'react-icons/fi';

let isUserInteracted = false;

// Lắng nghe sự kiện tương tác của người dùng
document.addEventListener('click', () => {
  isUserInteracted = true;
});

const showCustomToast = (username, text, createdAt) => {
  // Tạo và phát âm thanh thông báo nếu người dùng đã tương tác
  if (isUserInteracted) {
    const notificationSound = new Audio('/notification-sound.mp3');
    notificationSound.play().catch(error => console.error("Cannot play notification sound:", error));
  }

  toast(
    (t) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FiMessageCircle
          style={{
            fontSize: '2rem',
            color: '#4caf50',
            marginRight: '10px',
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '1rem',
              color: '#333',
            }}
          >
            {username || 'Unknown'}
          </div>
          <div
            style={{
              fontSize: '0.9rem',
              color: '#555',
            }}
          >
            {text}
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: '#888',
              marginTop: '5px',
            }}
          >
            {new Date(createdAt).toLocaleTimeString() || 'Invalid Date'}
          </div>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          style={{
            background: 'none',
            border: 'none',
            color: '#1976d2',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
        >
          Close
        </button>
      </div>
    ),
    {
      duration: 15000, // Hiển thị trong 15 giây
      position: 'top-right',
      style: {
        borderRadius: '10px',
        background: '#fff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '10px 15px',
        maxWidth: '400px',
      },
    }
  );
};

export default showCustomToast;
