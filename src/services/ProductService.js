import axios from 'axios';

const API_URL = "http://localhost:6001/products";

class ProductService {
  GetAllProduct() {
    return axios.get(API_URL);
  }

  GetAllProductByUser() {
    return axios.get(`${API_URL}/user`);
  }

  GetAllProductImages() {
    return axios.get(`${API_URL}/images`);
  }

  GetProductImagesByProductId(productId) {
    return axios.get(`${API_URL}/${productId}/images`);
  }

  DeleteProduct(productid) {
    return axios.delete(`${API_URL}/${productid}`);
  }

  GetProductById(productid) {
    return axios.get(`${API_URL}/${productid}`);
  }

  CreateProduct(product) {
    return axios.post(API_URL, product);
  }

  UpdateProduct(product, productid) {
    return axios.put(`${API_URL}/${productid}`, product);
  }

  DeleteProductImage(imageId) {
    return axios.delete(`${API_URL}/images/${imageId}`);
  }

  UploadProductImages(productId, formData) {
    return axios.post(`${API_URL}/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  SetPrimaryImage(productId, imageId) {
    return axios.put(`${API_URL}/${productId}/images/${imageId}/primary`);
  }
}

const instance = new ProductService();
export default instance;
