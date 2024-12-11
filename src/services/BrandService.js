import axios from 'axios';

class BrandService {
  // Cấu hình axios instance với URL mặc định
  axiosInstance = axios.create({
    baseURL: 'http://localhost:6001', // URL mặc định
  });

  // Lấy tất cả các thương hiệu
  getAllBrands() {
    return this.axiosInstance.get('/brands');
  }

  // Tạo mới thương hiệu
  createBrand(brand) {
    return this.axiosInstance.post('/brands', brand);
  }

  // Lấy thông tin thương hiệu theo ID
  getBrandById(brandId) {
    return this.axiosInstance.get(`/brands/${brandId}`);
  }

  // Cập nhật thông tin thương hiệu
  updateBrand(brand, brandId) {
    return this.axiosInstance.put(`/brands/${brandId}`, brand);
  }

  // Xóa thương hiệu
  deleteBrand(brandId) {
    return this.axiosInstance.delete(`/brands/${brandId}`);
  }
}

const instance = new BrandService();
export default instance;
