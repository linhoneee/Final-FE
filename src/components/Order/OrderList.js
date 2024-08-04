import { useEffect, useState } from "react";
import OrderService from "../../services/OrderService";
import { useSelector } from 'react-redux';

const OrderList = () => {
    const userId = useSelector(state => state.auth.userID);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            OrderService.GetOrdersByUser(userId).then((response) => {
                const parsedOrders = response.data.map(order => ({
                    ...order,
                    distanceData: JSON.parse(order.distanceData),
                    items: JSON.parse(order.items),
                    selectedShipping: JSON.parse(order.selectedShipping),
                }));
                setOrders(parsedOrders);
                console.log(parsedOrders);
                setLoading(false);
            }).catch((error) => {
                setError(error);
                setLoading(false);
            });
        }
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Order List</h1>
            {orders.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Total</th>
                            <th>Created At</th>
                            <th>Distance Data</th>
                            <th>Items</th>
                            <th>Selected Shipping</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.userId}</td>
                                <td>{order.total}</td>
                                <td>{order.createdAt}</td>
                                <td>
                                    <h4>User Address</h4>
                                    <p><strong>Receiver Name:</strong> {order.distanceData.receiverName}</p>
                                    <p><strong>Address:</strong> {`${order.distanceData.street}, ${order.distanceData.ward}, ${order.distanceData.district}, ${order.distanceData.provinceCity}`}</p>
                                    <p><strong>Latitude:</strong> {order.distanceData.originLatitude}</p>
                                    <p><strong>Longitude:</strong> {order.distanceData.originLongitude}</p>
                                    <h4>Warehouse Address</h4>
                                    <p><strong>Warehouse Name:</strong> {order.distanceData.warehouseName}</p>
                                    <p><strong>Address:</strong> {`${order.distanceData.warehouseWard}, ${order.distanceData.warehouseDistrict}, ${order.distanceData.warehouseProvinceCity}`}</p>
                                    <p><strong>Latitude:</strong> {order.distanceData.destinationLatitude}</p>
                                    <p><strong>Longitude:</strong> {order.distanceData.destinationLongitude}</p>
                                    <p><strong>Distance:</strong> {order.distanceData.distance} km</p>
                                </td>
                                <td>
                                    {Array.isArray(order.items) ? (
                                        <ul>
                                            {order.items.map((item, index) => (
                                                <li key={index}>
                                                    <p><strong>Product ID:</strong> {item.productId}</p>
                                                    <p><strong>Name:</strong> {item.name}</p>
                                                    <p><strong>Price:</strong> {item.price}</p>
                                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                                    <p><strong>Weight:</strong> {item.weight}</p>
                                                    <p><strong>Warehouse IDs:</strong> {item.warehouseIds}</p>
                                                    {item.primaryImageUrl && (
                                                        <div>
                                                            <p><strong>Image:</strong></p>
                                                            <img src={`http://localhost:6001${item.primaryImageUrl}`} alt={item.name} style={{ maxWidth: '200px', maxHeight: '200px' }} />
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No items found.</p>
                                    )}
                                </td>
                                <td>
                                    <p><strong>ID:</strong> {order.selectedShipping.id}</p>
                                    <p><strong>Name:</strong> {order.selectedShipping.name}</p>
                                    <p><strong>Price per Km:</strong> {order.selectedShipping.pricePerKm}</p>
                                    <p><strong>Price per Kg:</strong> {order.selectedShipping.pricePerKg}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default OrderList;
