// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:6001',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // Thêm vớiCredentials nếu bạn cần gửi cookies hoặc token qua CORS
// });

// axiosInstance.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('token');
//     console.log('Token:', token); // Kiểm tra xem token có tồn tại và hợp lệ không
//         if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }

//     // Log headers trước khi gửi request
//     // console.log('Request Headers:', config.headers);

//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
