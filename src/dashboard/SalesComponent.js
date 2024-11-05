import React, { useState, useEffect } from 'react';
import './SalesComponent.css';
const ReportAnalysis = () => {
  const [data, setData] = useState({
    totalSales: 0,
    totalOrders: 0,
    salesGrowthRate: 0,
    orderGrowthRate: 0,
  });
  const [dataUser, setDataUser] = useState({
    totalUser: 0,
  });
  useEffect(() => {
    // Hardcoded data from the given JSON
    const fetchedData = {
      totalSales: 6907.0,
      totalOrders: 50,
      salesGrowthRate: 404.7534429142603,
      orderGrowthRate: 412.5,
    };

    // Update state with fetched data
    setData(fetchedData);
    
    const fetchedDataUser = {
      totalUser: 100,

    };

    // Update state with fetched data
    setDataUser(fetchedDataUser);
  }, []);

  return (
    <div className="report-analysis">
      <div className="stats">
        <div className="stat">
          <h3>Total Sales</h3>
          <p className="value">${data.totalSales.toLocaleString()}</p>
          <p className="sub">{data.salesGrowthRate.toFixed(2)}% ↑ in the last month</p>
        </div>
        <div className="stat">
          <h3>Total Orders</h3>
          <p className="value">{data.totalOrders}</p>
          <p className="sub">{data.orderGrowthRate.toFixed(2)}% ↑ in the last month</p>
        </div>
        <div className="stat">
          <h3>Total User</h3>
          <p className="value">{dataUser.totalUser}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;
