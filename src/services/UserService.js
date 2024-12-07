import axios from 'axios';

const USER_API_BASE_URL = "http://localhost:8080/users";

class UserService {
    // Hàm lấy token từ localStorage
    getAuthToken() {
        return localStorage.getItem('token');  // Hoặc bạn có thể lấy từ Redux store nếu cần
    }

    // Hàm tạo instance axios với token trong header
    createAxiosInstance() {
        const token = this.getAuthToken();
        return axios.create({
            baseURL: USER_API_BASE_URL,
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
    }

    registerUser(user) {
        const instance = this.createAxiosInstance();
        return instance.post("/register", user);
    }

    loginUser(user) {
        const instance = this.createAxiosInstance();
        return instance.post("/login", user);
    }

    getUsers() {
        const instance = this.createAxiosInstance();
        return instance.get();
    }

    createUser(user) {
        const instance = this.createAxiosInstance();
        return instance.post("/register", user);
    }

    getUserById(userId) {
        const instance = this.createAxiosInstance();
        return instance.get(`/${userId}`);
    }

    updateUser(user, userId) {
        const instance = this.createAxiosInstance();
        return instance.put(`/${userId}`, user);
    }

    deleteUser(userId) {
        const instance = this.createAxiosInstance();
        return instance.delete(`/${userId}`);
    }

    blockUser(userId) {
        const instance = this.createAxiosInstance();
        return instance.put(`/block/${userId}`);
    }

    sendOtp(email) {
        const instance = this.createAxiosInstance();
        return instance.post("/forgot-password", { email });
    }

    verifyOtp(email, otp) {
        const instance = this.createAxiosInstance();
        return instance.post("/verify-otp", { email, otp });
    }

    resetPassword(email, newPassword) {
        const instance = this.createAxiosInstance();
        return instance.post("/reset-password", { email, newPassword });
    }

    checkEmailExists(email) {
        const instance = this.createAxiosInstance();
        return instance.post("/check-email", { email });
    }

    loginWithGoogle() {
        window.location.href = USER_API_BASE_URL + "/SSO/signingoogle";
    }

    updateUserPicture(id, picture) {
        const instance = this.createAxiosInstance();
        const formData = new FormData();
        formData.append('picture', picture);

        return instance.post(`/${id}/picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    getTotalUser(){
        const instance = this.createAxiosInstance();
        return instance.get("/count");
        
    }
}

const instance = new UserService();
export default instance;
