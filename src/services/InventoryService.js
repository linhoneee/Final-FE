import axios from 'axios';

const BASE_URL = 'http://localhost:6007/inventory';

class InventoryService {


  getInventoriesByWarehouseId(warehouseId) {
    return axios.get(`${BASE_URL}/warehouse/${warehouseId}`);
  }

  addProductToWarehouse(warehouseId, product) {
    return axios.post(`${BASE_URL}/warehouse/${warehouseId}/addProduct`, product);
  }
}

const instance = new InventoryService();
export default instance;
