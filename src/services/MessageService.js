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
}

const instance = new MessageService();
export default instance;
