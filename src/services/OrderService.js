import axios from "axios";

const URL = 'http://localhost:6006/orders';

class OrderService {

    GetOrdersByUser(userId) {
        return axios.get(`${URL}/${userId}`)
            .then(response => {
                return response; // Trả về kết quả nếu không có lỗi
            })
            .catch(error => {
                if (error.response) {
                    // Kiểm tra nếu có lỗi trả về từ backend
                    const errorMessage = error.response.data.message || 'Có lỗi xảy ra khi lấy đơn hàng.';
                    alert(`Error: ${errorMessage}`); // Hiển thị thông báo lỗi cho người dùng
                } else {
                    // Nếu không có phản hồi từ backend (ví dụ: lỗi mạng)
                    alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
                }
                throw error; // Ném lại lỗi để có thể xử lý ở nơi gọi phương thức này
            });
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



        getTopProvince() {
            return axios.get(`${URL}/top-provinces`);
        }


        getRateAndTotal(){
            return axios.get(`${URL}/api/order/statistics`);
        }

        getTopProducts(){
            return axios.get(`${URL}/api/order/top-products`);
        }

        
}

const instance = new OrderService();
export default instance;
