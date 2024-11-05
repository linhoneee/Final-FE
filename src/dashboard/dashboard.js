import React, { useEffect, useState } from 'react';
import BarChar from './BarChart';
import MapChart from './MapChart';
import SalesComponent from './SalesComponent';
import './Dashboard.css';
import TopProducts from './TopProducts';

const Dashboard = () => {
    const [showWelcome, setShowWelcome] = useState(true); // Trạng thái hiển thị thông báo chào mừng

    useEffect(() => {
        // Tự động ẩn thông báo sau 3 giây
        const timer = setTimeout(() => setShowWelcome(false), 3000);

        // Xóa timer khi component unmount
        return () => clearTimeout(timer);
    }, []);

    return (           
        <div className="dashboard-container">
            {showWelcome && (
                <div className="welcome-message">
                    Chào mừng bạn đến với <span>Dashboard</span>
                </div>
            )}
            <div className="salescomponent">
                <SalesComponent />
            </div>
            <div className="mapchart">
                <MapChart />
            </div>
            <div className="barchart">
                <BarChar />
            </div>
            <div className="top-products">
                <TopProducts />
            </div>
        </div>
    );
}

export default Dashboard;
