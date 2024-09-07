import axios from 'axios';

const USER_API_BASE_URL = "http://localhost:8080/users";

class UserService {
    registerUser(user) {
        return axios.post(USER_API_BASE_URL + "/register", user);
    }

    loginUser(user) {
        return axios.post(USER_API_BASE_URL + "/login", user);
    }

    getUsers() {
        return axios.get(USER_API_BASE_URL);
    }

    createUser(user) {
        return axios.post(USER_API_BASE_URL + "/register", user);
    }

    getUserById(userId) {
        return axios.get(USER_API_BASE_URL + '/' + userId);
    }

    updateUser(user, userId) {
        return axios.put(USER_API_BASE_URL + '/' + userId, user);
    }

    deleteUser(userId) {
        return axios.delete(USER_API_BASE_URL + '/' + userId);
    }

    blockUser(userId) {
        return axios.put(USER_API_BASE_URL + '/block/' + userId);
    }

    sendOtp(email) {
        return axios.post(USER_API_BASE_URL + "/forgot-password", { email });
    }

    verifyOtp(email, otp) {
        return axios.post(USER_API_BASE_URL + "/verify-otp", { email, otp });
    }

    resetPassword(email, newPassword) {
        return axios.post(USER_API_BASE_URL + "/reset-password", { email, newPassword });
    }

    checkEmailExists(email) {
        return axios.post(USER_API_BASE_URL + "/check-email", { email });
    }

    loginWithGoogle() {
        window.location.href = USER_API_BASE_URL + "/SSO/signingoogle";
    }

    updateUserPicture(id, picture) {
        const formData = new FormData();
        formData.append('picture', picture);

        return axios.post(`${USER_API_BASE_URL}/${id}/picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}

const instance = new UserService();
export default instance;
