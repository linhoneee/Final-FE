import { useEffect, useState } from "react";
import OrderService from "../../services/OrderService";
import { useSelector } from 'react-redux';
import ReviewModal from "../Review/ReviewModal";
import CoordinatesModal from "./CoordinatesModal"; // Import modal tọa độ mới tạo
import "./OrderList.css"; // Import the CSS file

const OrderList = () => {
    const userId = useSelector(state => state.auth.userID);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null); // State to hold the selected product for review
    const [showCoordinatesModal, setShowCoordinatesModal] = useState(false); // State to control coordinates modal
    const [selectedDistanceData, setSelectedDistanceData] = useState(null); // State to hold the selected distance data
    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const ordersPerPage = 2; // Number of orders per page

    useEffect(() => {
        if (userId) {
            OrderService.GetOrdersByUser(userId).then((response) => {
                const parsedOrders = response.data.map(order => ({
                    ...order,
                    distanceData: JSON.parse(order.distanceData),
                    selectedShipping: JSON.parse(order.selectedShipping), // Parse selectedShipping
                    items: JSON.parse(order.items).map(item => ({
                        ...item,
                        isReviewed: item.isReviewed || false
                    }))
                }));
                // Sort orders by date, with the most recent first
                parsedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(parsedOrders);
                console.log(parsedOrders);
                setLoading(false);
            }).catch((error) => {
                setError(error);
                setLoading(false);
            });
        }
    }, [userId]);

    const handleReviewClick = (order, product) => {
        setSelectedProduct({ orderId: order.id, product }); // Set the selected product for the modal
    };

    const handleViewLocation = (distanceData) => {
        setSelectedDistanceData(distanceData); // Set distance data to be displayed in the modal
        setShowCoordinatesModal(true); // Show the modal
    };

    const handleReviewSuccess = async (orderId, productId) => {
        // Cập nhật trạng thái sản phẩm trên backend
        await OrderService.markProductAsReviewed(orderId, productId);

        // Update the orders state to mark the product as reviewed
        setOrders(orders.map(order =>
            order.id === orderId ? {
                ...order,
                items: order.items.map(item =>
                    item.productId === productId ? { ...item, isReviewed: true } : item
                )
            } : order
        ));
        setSelectedProduct(null); // Close the modal
    };

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error.message}</div>;
    }

    return (
        <div className="order-list-container">
            <h1 className="order-list-header">Lịch Sử Đơn Hàng</h1>
            {currentOrders.length > 0 ? (
                <div className="order-list">
                    {currentOrders.map((order) => (
                        <div className="order-card" key={order.id}>
                            <div className="order-header">
                                <h2 className="order-id">Đơn Hàng #{order.id}</h2>
                                <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="order-body">
                                <div className="order-info">
                                    <p><strong>Tổng cộng:</strong> ${order.total ? order.total.toFixed(2) : 'N/A'}</p>
                                    <p><strong>Khoảng cách:</strong> {order.distanceData.distance} km</p>
                                    <p><strong>Vận chuyển:</strong> {order.selectedShipping.name}</p>
                                </div>
                                <div className="order-addresses">
                                    <div className="address">
                                        <h3>Địa Chỉ Kho</h3>
                                        <p><strong>Tên:</strong> {order.distanceData.warehouseName}</p>
                                        <p><strong>Địa chỉ:</strong> {`${order.distanceData.warehouseWard}, ${order.distanceData.warehouseDistrict}, ${order.distanceData.warehouseProvinceCity}`}</p>
                                    </div>
                                    <div className="address">
                                        <h3>Địa Chỉ Người Nhận</h3>
                                        <p><strong>Tên:</strong> {order.distanceData.receiverName}</p>
                                        <p><strong>Địa chỉ:</strong> {`${order.distanceData.street}, ${order.distanceData.ward}, ${order.distanceData.district}, ${order.distanceData.provinceCity}`}</p>
                                    </div>
                                    <button className="view-location-button" onClick={() => handleViewLocation(order.distanceData)}>Xem Vị Trí</button>
                                </div>
                                <div className="order-items">
                                    <h3>Sản Phẩm</h3>
                                    {Array.isArray(order.items) ? (
                                        <ul className="items-list">
                                            {order.items.map((item, index) => (
                                                <li className="item" key={index}>
                                                    <div className="item-image">
                                                        {item.primaryImageUrl && (
                                                            <img src={`http://localhost:6001${item.primaryImageUrl}`} alt={item.name} />
                                                        )}
                                                    </div>
                                                    <div className="item-details">
                                                        <p><strong>{item.name}</strong></p>
                                                        <p>Mã sản phẩm: {item.productId}</p>
                                                        <p>Giá: ${item.price ? item.price.toFixed(2) : 'N/A'}</p>
                                                        <p>Số lượng: {item.quantity}</p>
                                                        {!item.isReviewed && (
                                                            <button className="review-button" onClick={() => handleReviewClick(order, item)}>Đánh Giá</button>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Không tìm thấy sản phẩm nào.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="pagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-button"
                        >
                            Trang Trước
                        </button>
                        <span className="pagination-info">
                            Trang {currentPage} trên {totalPages}
                        </span>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="pagination-button"
                        >
                            Trang Tiếp
                        </button>
                    </div>
                </div>
            ) : (
                <p>Không có đơn hàng nào.</p>
            )}
            {selectedProduct && (
                <ReviewModal
                    order={orders.find(o => o.id === selectedProduct.orderId)}
                    product={selectedProduct.product}
                    onClose={() => setSelectedProduct(null)}
                    onSuccess={handleReviewSuccess}
                />
            )}
            {showCoordinatesModal && (
                <CoordinatesModal
                    show={showCoordinatesModal}
                    handleClose={() => setShowCoordinatesModal(false)}
                    distanceData={selectedDistanceData}
                />
            )}
        </div>

    );
};

export default OrderList;
