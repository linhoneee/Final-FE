import axios from 'axios';

const BASE_URL = 'http://localhost:6001/brands';

class BrandService {
  getAllBrands() {
    return axios.get(BASE_URL);
  }

  createBrand(brand) {
    return axios.post(BASE_URL, brand);
  }

  getBrandById(brandId) {
    return axios.get(`${BASE_URL}/${brandId}`);
  }

  updateBrand(brand, brandId) {
    return axios.put(`${BASE_URL}/${brandId}`, brand);
  }

  deleteBrand(brandId) {
    return axios.delete(`${BASE_URL}/${brandId}`);
  }
}

const instance = new BrandService();
export default instance;
