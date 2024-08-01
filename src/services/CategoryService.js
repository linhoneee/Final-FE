import axios from 'axios';

const BASE_URL = 'http://localhost:6001/categories';

class CategoryService {
  getAllCategories() {
    return axios.get(BASE_URL);
  }

  createCategory(category) {
    return axios.post(BASE_URL, category);
  }

  getCategoryById(categoryId) {
    return axios.get(`${BASE_URL}/${categoryId}`);
  }

  updateCategory(category, categoryId) {
    return axios.put(`${BASE_URL}/${categoryId}`, category);
  }

  deleteCategory(categoryId) {
    return axios.delete(`${BASE_URL}/${categoryId}`);
  }
}

const instance = new CategoryService();
export default instance;