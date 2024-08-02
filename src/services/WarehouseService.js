// src/services/WarehouseService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:6007/api/warehouses';

class WarehouseService {
  getAllWarehouses() {
    return axios.get(`${BASE_URL}/all`);
  }

  createWarehouse(warehouse) {
    return axios.post(BASE_URL, warehouse);
  }

  getWarehouseById(warehouseId) {
    return axios.get(`${BASE_URL}/${warehouseId}`);
  }

  updateWarehouse(warehouseId, warehouse) {
    return axios.put(`${BASE_URL}/${warehouseId}`, warehouse);
  }

  deleteWarehouse(warehouseId) {
    return axios.delete(`${BASE_URL}/${warehouseId}`);
  }


}

const instance = new WarehouseService();
export default instance;
