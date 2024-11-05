import axios from "axios";

const URL = 'http://localhost:6006/orders';

class OrderService {

    GetOrdersByUser(userId) {
        return axios.get(`${URL}/${userId}`);
    }

    markProductAsReviewed = (orderId, productId) => {
        return axios.patch(`${URL}/${orderId}/products/${productId}/reviewed`);
    };

        // API để lấy doanh thu theo ngày
        getRevenueByDay(day) {
            return axios.get(`${URL}/revenue-by-hour?date=${day}`);
        }
    
        // API để lấy doanh thu theo tuần
        getRevenueByWeek(date) {
            return axios.get(`${URL}/revenue-by-day-of-week?date=${date}`);
        }
    
        getRevenueByDayOfMonth = (year, month) => {
            return axios.get(`${URL}/revenue-by-day-of-month`, {
                params: { year, month }
            });
        };
    
        getRevenueByMonthOfYear = (year) => {
            return axios.get(`${URL}/revenue-by-month-of-year`, {
                params: { year }
            });
        };

        getCurrentLocation(orderId) {
            return axios.get(`${URL}/${orderId}/current-location`);
        }
        
}

const instance = new OrderService();
export default instance;
