import React, { useState, useEffect } from 'react';
import './SalesComponent.css';
import OrderService from '../services/OrderService';
import UserService from '../services/UserService';

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
    const fetchData = async () => {
      try {
        // Lấy dữ liệu từ OrderService
        OrderService.getRateAndTotal().then((response)=>{
          setData(response.data);
          console.log(response.data)

        })


        UserService.getTotalUser().then((response)=>{
          setDataUser(response.data);
          console.log(response.data)

        })


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Gọi hàm fetchData
    fetchData();
  }, []); // Chạy lần đầu tiên khi component mount

  return (
    <div className="report-analysis">
      <div className="stats">
        <div className="stat">
          <h3>Tổng doanh thu</h3>
          <p className="value">${data.totalSales?.toLocaleString() || 0}</p>
          <p className="sub">{data.salesGrowthRate?.toFixed(2) || 0}% ↑ trong tháng trước</p>
        </div>
        <div className="stat">
          <h3>Tổng số đơn hàng</h3>
          <p className="value">{data.totalOrders || 0}</p>
          <p className="sub">{data.orderGrowthRate?.toFixed(2) || 0}% ↑ trong tháng trước</p>
        </div>
        <div className="stat">
          <h3>Tổng số người dùng</h3>
          <p className="value">{dataUser.totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;
