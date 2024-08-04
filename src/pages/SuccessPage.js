import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentRequest, setCurrentRequest] = useState(null);

    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get('paymentId');
    const payerId = queryParams.get('PayerID');
    const currentRequestJson = queryParams.get('currentRequest');

    useEffect(() => {
        // Giải mã currentRequest từ chuỗi JSON
        if (currentRequestJson) {
            setCurrentRequest(JSON.parse(decodeURIComponent(currentRequestJson)));
        }

        // Fetch payment details nếu cần thiết
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8009/payment/details`, {
                    params: {
                        paymentId: paymentId,
                        payerId: payerId,
                    },
                });
                console.log(response.data); // Log chi tiết thanh toán nếu cần
            } catch (error) {
                console.error('Error fetching payment details', error);
            }
        };

        if (paymentId && payerId) {
            fetchPaymentDetails();
        }
    }, [paymentId, payerId, currentRequestJson]);

    if (!currentRequest) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Payment Successful</h1>
            <p>Payment ID: {paymentId}</p>
            <p>Payer ID: {payerId}</p>
            <h2>Request Details</h2>
            <p><strong>ID:</strong> {currentRequest.id}</p>
            <p><strong>User ID:</strong> {currentRequest.userId}</p>
            <h3>Items:</h3>
            <ul>
                {currentRequest.items.map((item, index) => (
                    <li key={index}>
                        <p><strong>Product ID:</strong> {item.productId}</p>
                        <p><strong>Name:</strong> {item.name}</p>
                        <p><strong>Price:</strong> {item.price}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Weight:</strong> {item.weight}</p>
                        {item.primaryImageUrl && (
                            <div>
                                <p><strong>Image:</strong></p>
                                <img src={`http://localhost:6001${item.primaryImageUrl}`} alt={item.name} style={{ maxWidth: '200px', maxHeight: '200px' }} />
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <h3>Selected Shipping:</h3>
            <p><strong>ID:</strong> {currentRequest.selectedShipping.id}</p>
            <p><strong>Name:</strong> {currentRequest.selectedShipping.name}</p>
            <p><strong>Price per Kg:</strong> {currentRequest.selectedShipping.pricePerKg}</p>
            <p><strong>Price per Km:</strong> {currentRequest.selectedShipping.pricePerKm}</p>
            <h3>Distance Data:</h3>
            <p><strong>Destination Latitude:</strong> {currentRequest.distanceData.destinationLatitude}</p>
            <p><strong>Destination Longitude:</strong> {currentRequest.distanceData.destinationLongitude}</p>
            <p><strong>Distance:</strong> {currentRequest.distanceData.distance}</p>
            <p><strong>District:</strong> {currentRequest.distanceData.district}</p>
            <p><strong>Origin Latitude:</strong> {currentRequest.distanceData.originLatitude}</p>
            <p><strong>Origin Longitude:</strong> {currentRequest.distanceData.originLongitude}</p>
            <p><strong>Province/City:</strong> {currentRequest.distanceData.provinceCity}</p>
            <p><strong>Receiver Name:</strong> {currentRequest.distanceData.receiverName}</p>
            <p><strong>Street:</strong> {currentRequest.distanceData.street}</p>
            <p><strong>Ward:</strong> {currentRequest.distanceData.ward}</p>
            <p><strong>Warehouse District:</strong> {currentRequest.distanceData.warehouseDistrict}</p>
            <p><strong>Warehouse ID:</strong> {currentRequest.distanceData.warehouseId}</p>
            <p><strong>Warehouse Name:</strong> {currentRequest.distanceData.warehouseName}</p>
            <p><strong>Warehouse Province/City:</strong> {currentRequest.distanceData.warehouseProvinceCity}</p>
            <p><strong>Warehouse Ward:</strong> {currentRequest.distanceData.warehouseWard}</p>
            <p><strong>Total:</strong> {currentRequest.total}</p>
            <button onClick={() => navigate('/')}>Go Back Home</button>
        </div>
    );
};

export default SuccessPage;
