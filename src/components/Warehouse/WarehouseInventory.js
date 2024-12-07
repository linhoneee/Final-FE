import React, { useEffect, useState } from 'react';
import InventoryService from '../../services/InventoryService';
import ProductService from '../../services/ProductService';
import Modal from 'react-modal';
import './WarehouseInventoryModal.css';

Modal.setAppElement('#root'); // Đặt phần tử gốc cho react-modal

const WarehouseInventory = ({ warehouseId }) => {
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

  if (loading) {
    return <p>Loading inventory details...</p>;
  }

  if (error) {
    return <p>Error loading inventory details: {error.message}</p>;
  }

  return (
    <div>
<h3>Chi tiết Kho Hàng cho ID Kho: {warehouseId}</h3>
<table className="warehouse-inventory-table">
  <thead>
    <tr>
      <th>ID Sản phẩm</th>
      <th>Số lượng</th>
      <th>Ngày cập nhật</th>
      <th>Tên sản phẩm</th>
      <th>Giá</th>
      {/* <th>Cân nặng</th> */}
      <th>Chi tiết mô tả</th>
      <th>Hình ảnh</th>
    </tr>
  </thead>

        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.productId}</td>
              <td>{item.quantity}</td>
              <td>
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }).format(new Date(item.updatedAt))}
              </td>
              {productDetails[item.productId] ? (
                <>
                  <td>{productDetails[item.productId].product.productName}</td>
                  <td>{productDetails[item.productId].product.price}</td>
                  {/* <td>{productDetails[item.productId].product.weight}</td> */}
                  <td>{productDetails[item.productId].product.descriptionDetails}</td>
                  <td>
                    {productDetails[item.productId].productImages.map((image) => (
                      <img
                        key={image.id}
                        src={`http://localhost:6001${image.url}`}
                        alt="Product"
                        onClick={() => openModal(image)}
                      />
                    ))}
                  </td>
                </>
              ) : (
<td colSpan="5">Không có chi tiết sản phẩm</td>
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
    </div>
  );
};

export default WarehouseInventory;
