import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SuccessPage.css';
import { FaCheckCircle, FaShippingFast, FaMoneyBillWave, FaBoxOpen } from 'react-icons/fa';

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentRequest, setCurrentRequest] = useState(null);

    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get('paymentId');
    const payerId = queryParams.get('PayerID');
    const currentRequestJson = queryParams.get('currentRequest');

    useEffect(() => {
        if (currentRequestJson) {
            const requestData = JSON.parse(decodeURIComponent(currentRequestJson));

            // Nối địa chỉ người gửi và người nhận
            const senderAddress = `${requestData.distanceData.warehouseWard}, ${requestData.distanceData.warehouseDistrict}, ${requestData.distanceData.warehouseProvinceCity
            }`;
            const receiverAddress = `${requestData.distanceData.street}, ${requestData.distanceData.ward}, ${requestData.distanceData.district}, ${requestData.distanceData.provinceCity}`;
            
            // Thêm vào currentRequest
            requestData.senderAddress = senderAddress;
            requestData.receiverAddress = receiverAddress;

            setCurrentRequest(requestData);
        }
    }, [paymentId, payerId, currentRequestJson]);

    if (!currentRequest) {
        return <div className="loading">Loading...</div>;
    }
    if (currentRequest) {
        console.log(currentRequest);
    }
    return (
        <div className="success-container">
            <div className="success-header">
                <FaCheckCircle className="success-icon bounce" />
                <h1>Thanh toán thành công</h1>
                <p>Đơn hàng của bạn đã được xử lý thành công. Cảm ơn bạn đã lựa chọn chúng tôi!</p>
            </div>
            <div className="success-details">
                <div className="card">
                    <h2>
                        <FaMoneyBillWave className="icon" /> Thông tin thanh toán
                    </h2>
                    <p><strong>Mã thanh toán:</strong> {paymentId}</p>
                    <p><strong>Mã người thanh toán:</strong> {payerId}</p>
                </div>
                <div className="card">
                    <h2>
                        <FaShippingFast className="icon" /> Thông tin vận chuyển
                    </h2>
                    <p><strong>Phương thức vận chuyển:</strong> {currentRequest.selectedShipping.name}</p>
                    <div className="address-section">
                        <div>
                            <h3>Địa chỉ người gửi</h3>
                            <p>{currentRequest.senderAddress}</p>
                        </div>
                        <div>
                            <h3>Địa chỉ người nhận</h3>
                            <p>{currentRequest.receiverAddress}</p>
                        </div>
                    </div>
                    <h2>Khoảng cách: {currentRequest.distanceData.distance} Km </h2>
                </div>
                <div className="card">
                    <h2>
                        <FaBoxOpen className="icon" /> Thông tin đơn hàng
                    </h2>
                    <ul className="item-list">
                        {currentRequest.items.map((item, index) => (
                            <li key={index} className="item">
                                <img src={`http://localhost:6001${item.primaryImageUrl}`} alt={item.name} />
                                <div>
                                    <p><strong>Tên sản phẩm:</strong> {item.name}</p>
                                    <p><strong>Giá:</strong> {item.price}</p>
                                    <p><strong>Số lượng:</strong> {item.quantity}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card total-section">
                    <h3>Tổng cộng</h3>
                    <p><strong>Tổng tiền:</strong> ${currentRequest.total.toFixed(2)}</p>
                </div>
            </div>
            <button className="back-home-button" onClick={() => navigate('/')}>Quay lại trang chủ</button>
        </div>
    );
};

export default SuccessPage;
