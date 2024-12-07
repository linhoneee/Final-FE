import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './StoreLocator.css';  // Import file CSS

// Biểu tượng tùy chỉnh cho cửa hàng
const storeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/869/869636.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

// Thành phần để điều chỉnh bản đồ vừa với tất cả các điểm
const FitMapBounds = ({ bounds }) => {
    const map = useMap();
    
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        }
    }, [bounds, map]);

    return null;
};

const StoreLocator = () => {
    const [stores] = useState([
        {
            id: 1,
            name: 'Cửa hàng Hà Nội',
            position: [21.028511, 105.804817],
            address: '123 Phố Cổ, Hoàn Kiếm, Hà Nội',
        },
        {
            id: 2,
            name: 'Cửa hàng Đà Nẵng',
            position: [16.047079, 108.206230],
            address: '456 Đường Biển, Sơn Trà, Đà Nẵng',
        }
    ]);

    const [selectedStore, setSelectedStore] = useState(stores[0]);
    const [userPosition, setUserPosition] = useState(null);
    const [route, setRoute] = useState([]);
    const mapRef = useRef(null);

    // Lấy tuyến đường giữa vị trí người dùng và cửa hàng sử dụng API Mapbox Directions
    const getRoute = async (userPosition, storePosition) => {
        const API_KEY = 'pk.eyJ1IjoibGluaGVoZWhlaGVoIiwiYSI6ImNtMjQ3b3U2MzBkNXgybnNkNWdsZWFqYWwifQ.xIwS3-5eMZu0w5SsczzNDw'; 
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userPosition[1]},${userPosition[0]};${storePosition[1]},${storePosition[0]}?geometries=geojson&access_token=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
            const coordinates = data.routes[0].geometry.coordinates;
            const geoJsonRoute = coordinates.map(coord => [coord[1], coord[0]]);
            setRoute(geoJsonRoute);
        }
    };

    // Yêu cầu vị trí người dùng khi tải trang
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
        
                    console.log('Vĩ độ:', latitude);
                    console.log('Kinh độ:', longitude);
        
                    setUserPosition([latitude, longitude]);
                },
                (error) => {
                    console.error('Lỗi khi lấy vị trí người dùng:', error);
                },
                {
                    enableHighAccuracy: true,  // Bật độ chính xác cao
                    timeout: 10000,            // Thời gian chờ (10 giây)
                    maximumAge: 0              // Không sử dụng kết quả cũ
                }
            );
        } else {
            console.error('Trình duyệt không hỗ trợ định vị.');
        }
    }, []);

    // Tự động tính toán và lấy tuyến đường khi vị trí người dùng hoặc cửa hàng thay đổi
    useEffect(() => {
        if (userPosition && selectedStore) {
            getRoute(userPosition, selectedStore.position);
        }
    }, [userPosition, selectedStore]);

    // Tính toán vùng hiển thị để vừa với tất cả các điểm
    const calculateBounds = () => {
        if (!userPosition || !selectedStore) return null;
        
        const allPositions = [userPosition, selectedStore.position];
        
        if (route.length > 0) {
            allPositions.push(...route);
        }

        return L.latLngBounds(allPositions);
    };

    const bounds = calculateBounds();

    return (
        <div className="store-locator">
            <div className="store-header">
                <h1>Hành trình xanh, điểm đến GreenHome</h1>
                <p>
                GreenHome – nơi hội tụ những thiết bị điện máy thân thiện với môi trường – dễ dàng tìm thấy dù bạn đi bằng ô tô hay phương tiện công cộng. Hãy để hành trình của bạn thêm ý nghĩa với một điểm đến xanh, gần gũi và đầy cảm hứng.
                </p>
            </div>

            {/* Các nút chọn cửa hàng */} 
            <div className="store-buttons">
                {stores.map(store => (
                    <button key={store.id} onClick={() => setSelectedStore(store)}>
                        {store.name}
                    </button>
                ))}
            </div>

            {/* Bản đồ và thông tin cửa hàng */} 
            <div className="store-content">
                <div className="map-section">
                    <MapContainer
                        center={userPosition || [21.028511, 105.804817]}  // Trung tâm mặc định nếu chưa có vị trí người dùng
                        zoom={13}  // Mức zoom mặc định
                        style={{ height: '400px', width: '100%' }}
                        whenCreated={(mapInstance) => mapRef.current = mapInstance}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* Đánh dấu vị trí người dùng */} 
                        {userPosition && (
                            <Marker position={userPosition}>
                                <Popup>Vị trí của bạn</Popup>
                            </Marker>
                        )}

                        {/* Đánh dấu vị trí cửa hàng đã chọn */} 
                        <Marker position={selectedStore.position} icon={storeIcon}>
                            <Popup>{selectedStore.name}</Popup>
                        </Marker>

                        {/* Hiển thị tuyến đường */} 
                        {route && route.length > 0 && (
                            <Polyline positions={route} color="blue" />
                        )}

                        {/* Điều chỉnh bản đồ vừa với tất cả các điểm */} 
                        {bounds && <FitMapBounds bounds={bounds} />}
                    </MapContainer>
                </div>

                {/* Thông tin cửa hàng */} 
                <div className="store-info">
                    <h3>{selectedStore.name}</h3>
                    <p>Địa chỉ: {selectedStore.address}</p>
                    <div className="transport-links">
                        <h4>Kết nối giao thông</h4>
                        <p>DLR Cutty Sark (khoảng 3 phút đi bộ)</p>
                        <p>Greenwich và Maze Hill (khoảng 8 phút đi bộ)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreLocator;
