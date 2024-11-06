import axios from 'axios';

// Đặt URL API của bạn ở đây
const API_URL = 'http://localhost:6010/api/messages';

class MessageService {
  getMessagesByRoomId(roomId) {
    return axios.get(`${API_URL}/room/${roomId}`);
  }

  getAllMessages() {
    return axios.get(API_URL);
  }

  sendMessage(message) {
    return axios.post(API_URL, message);
  }
  getLatestMessagesForAllRooms(userId) {
    return axios.get(`${API_URL}/latestMessages`, {
        params: {
            userId: userId // Thêm userId vào query params
        }
    });
}
  // Phương thức gửi phương tiện (ảnh, video, ghi âm)
  sendMedia(formData) {
    return axios.post(`${API_URL}/sendMedia`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}


const instance = new MessageService();
export default instance;
