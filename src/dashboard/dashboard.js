import React from 'react';
import BarChar from './BarChart';
import MapChart from './MapChart';
import SalesComponent from './SalesComponent';
import './Dashboard.css';

const Dashboard = () => {
    return (           
        <div className="dashboard-container">
            <div className="salescomponent">
                <SalesComponent />
            </div>
            <div className="barchart">
                <BarChar />
            </div>
            <div className="mapchart">
                <MapChart />
            </div>
        </div>
    );
}
 
export default Dashboard;
