import { useEffect, useState } from "react";
import ShippingService from "../../services/ShippingService";
import AddShipping from "./AddShipping";
import UpdateShipping from "./UpdateShipping";
import './ShippingList.css';
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast function

const ShippingList = () => {
  const [shippings, setShippings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(null);

  useEffect(() => {
    fetchShippings();
  }, []);

  const fetchShippings = () => {
    ShippingService.getAllShipping()
      .then((response) => {
        setShippings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching shipping data:', error);
      });
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const openEditModal = (shipping) => {
    setSelectedShipping(shipping);
    setShowEditModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedShipping(null);
  };

  const deleteShipping = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa shipping này?");
    if (confirmDelete) {
      ShippingService.deleteShippingById(id)
        .then(() => {
          // Cập nhật lại danh sách shipping sau khi xóa thành công
          setShippings(shippings.filter((shipping) => shipping.id !== id));
          
          // Hiển thị thông báo thành công
          showGeneralToast("Shipping đã được xóa thành công!", "success");
        })
        .catch((error) => {
          console.error('Error deleting shipping data:', error);
          
          // Hiển thị thông báo lỗi nếu có
          if (error.response && error.response.data) {
            const { message } = error.response.data;
            showGeneralToast(message, "error");
          } else {
            showGeneralToast("Có lỗi xảy ra khi xóa shipping", "error");
          }
        });
    }
  };
  

  return (
    <div className="shipping-list-container">
      <h2 className="shipping-list-title">Danh sách loại vận chuyển</h2>
      <button onClick={openAddModal} className="shipping-list-btn shipping-list-btn-primary">Thêm loại vận chuyển</button>
      <table className="shipping-list-table shipping-list-table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giá theo km</th>
            <th>Giá theo kg</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {shippings.map((shipping) => (
            <tr key={shipping.id}>
              <td>{shipping.id}</td>
              <td>{shipping.name}</td>
              <td>{shipping.pricePerKm}</td>
              <td>{shipping.pricePerKg}</td>
              <td>
                <button onClick={() => openEditModal(shipping)} className="shipping-list-btn shipping-list-btn-info">Chỉnh sửa</button>
                <button onClick={() => deleteShipping(shipping.id)} className="shipping-list-btn shipping-list-btn-danger">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AddShipping closeModal={closeAddModal} fetchShippings={fetchShippings} />
          </div>
        </div>
      )}

      {showEditModal && selectedShipping && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <UpdateShipping
              shipping={selectedShipping}
              closeModal={closeEditModal}
              fetchShippings={fetchShippings}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingList;
