
import '../../Css/ImageModal.css'; 
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InventoryService from '../../services/InventoryService';
import ProductService from '../../services/ProductService';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Đặt phần tử gốc cho react-modal

const WarehouseInventory = () => {
  const { warehouseId } = useParams();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    InventoryService.getInventoriesByWarehouseId(warehouseId).then((response) => {
      const inventoryData = response.data;
      setInventory(inventoryData);
      console.log('Inventory Data:', inventoryData);

      const productDetailPromises = inventoryData.map((item) =>
        ProductService.GetProductById(item.productId)
          .then((res) => ({ id: item.productId, data: res.data }))
          .catch((err) => {
            console.error(`Error fetching details for product ID ${item.productId}:`, err);
            return null; // Return null in case of error
          })
      );

      Promise.all(productDetailPromises)
        .then((products) => {
          const productDetailsMap = products.reduce((acc, product) => {
            if (product !== null) {
              acc[product.id] = product.data;
            }
            return acc;
          }, {});
          setProductDetails(productDetailsMap);
          console.log('Product Details:', productDetailsMap);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching product details:', err);
          setError(err);
          setLoading(false);
        });
    }).catch((err) => {
      console.error('Error fetching inventory:', err);
      setError(err);
      setLoading(false);
    });
  }, [warehouseId]);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  const handleAddProduct = () => {
    navigate(`/warehouse/${warehouseId}/addProduct`);
  };

  if (loading) {
    return <p>Loading inventory details...</p>;
  }

  if (error) {
    return <p>Error loading inventory details: {error.message}</p>;
  }

  return (
    <div>
      <h1>Warehouse Inventory for Warehouse ID: {warehouseId}</h1>
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Updated At</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Weight</th>
            <th>Description Details</th>
            <th>Images</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.productId}</td>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.updatedAt}</td>
              {productDetails[item.productId] ? (
                <>
                  <td>{productDetails[item.productId].product.productName}</td>
                  <td>{productDetails[item.productId].product.price}</td>
                  <td>{productDetails[item.productId].product.weight}</td>
                  <td>{productDetails[item.productId].product.descriptionDetails}</td>
                  <td>
                    {productDetails[item.productId].productImages.map((image) => (
                      <img
                        key={image.id}
                        src={`http://localhost:6001${image.url}`}
                        alt="Product"
                        style={{ width: '50px', height: '50px', margin: '5px', cursor: 'pointer' }}
                        onClick={() => openModal(image)}
                      />
                    ))}
                  </td>
                </>
              ) : (
                <td colSpan="5">No product details available</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedImage && (
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-content">
          <img src={`http://localhost:6001${selectedImage.url}`} alt="Selected" />
          <button onClick={closeModal} className="modal-close-button">Close</button>
        </Modal>
      )}

      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  );
};

export default WarehouseInventory;
