import axios from "axios";

const URL = 'http://localhost:6006/orders';

class OrderService {

    GetOrdersByUser(userId) {
        return axios.get(`${URL}/${userId}`);
    }
}

const instance = new OrderService();
export default instance;
