import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import OrderService from '../services/OrderService';
import './BarChart.css'; // Import file CSS

const BarChar = () => {
    const [monthData, setMonthData] = useState([]);
    const [yearData, setYearData] = useState([]);
    const [chartType, setChartType] = useState('month'); // Mặc định hiển thị biểu đồ tháng

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const lastMonth = new Date(today);
                lastMonth.setMonth(today.getMonth() - 1);

                const lastYear = new Date(today);
                lastYear.setFullYear(today.getFullYear() - 1);

                // Gọi API cho doanh thu theo ngày của tháng này và tháng trước
                const revenueThisMonth = await OrderService.getRevenueByDayOfMonth(today.getFullYear(), today.getMonth() + 1);
                const revenueLastMonth = await OrderService.getRevenueByDayOfMonth(lastMonth.getFullYear(), lastMonth.getMonth() + 1);

                // So sánh từng ngày trong tháng hiện tại
                const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); // Số ngày trong tháng hiện tại
                let monthComparison = [];
                for (let i = 1; i <= daysInCurrentMonth; i++) {
                    monthComparison.push({
                        name: `Ngày ${i}`,
                        'Tháng này': revenueThisMonth.data[i - 1] || 0,
                        'Tháng trước': revenueLastMonth.data[i - 1] || 0
                    });
                }
                setMonthData(monthComparison);

                // Gọi API cho doanh thu theo tháng của năm nay và năm trước
                const revenueThisYear = await OrderService.getRevenueByMonthOfYear(today.getFullYear());
                const revenueLastYear = await OrderService.getRevenueByMonthOfYear(lastYear.getFullYear());

                // So sánh từng tháng trong năm
                let yearComparison = [];
                for (let i = 1; i <= 12; i++) {
                    yearComparison.push({
                        name: `Tháng ${i}`,
                        'Năm nay': revenueThisYear.data[i - 1] || 0,
                        'Năm trước': revenueLastYear.data[i - 1] || 0
                    });
                }
                setYearData(yearComparison);

            } catch (error) {
                console.error("Error fetching revenue data:", error);
            }
        };

        fetchData();
    }, []);

    const renderMonthChart = () => (
        <div className="bar-chart-container">
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthData} className="bar-chart">
                    <CartesianGrid className="grid" />
                    <XAxis dataKey="name" className="axis" />
                    <YAxis className="axis" />
                    <Tooltip />
                    <Legend />
                    {/* Sử dụng màu sắc gradient cho cột */}
                    <Bar dataKey="Tháng này" fill="#8884d8" />
                    <Bar dataKey="Tháng trước" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    const renderYearChart = () => (
        <div className="bar-chart-container">
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={yearData} className="bar-chart">
                    <CartesianGrid className="grid" />
                    <XAxis dataKey="name" className="axis" />
                    <YAxis className="axis" />
                    <Tooltip />
                    <Legend />
                    {/* Sử dụng màu sắc gradient cho cột */}
                    <Bar dataKey="Năm nay" fill="#8884d8" />
                    <Bar dataKey="Năm trước" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <h2>Chọn biểu đồ để hiển thị</h2>
            <button onClick={() => setChartType('month')}>Doanh thu theo tháng</button>
            <button onClick={() => setChartType('year')}>Doanh thu theo năm</button>

            {chartType === 'month' && (
                <>
                    <h2>Doanh thu theo tháng</h2>
                    {monthData.length > 0 ? renderMonthChart() : <p>Không có dữ liệu doanh thu theo tháng.</p>}
                </>
            )}

            {chartType === 'year' && (
                <>
                    <h2>Doanh thu theo năm</h2>
                    {yearData.length > 0 ? renderYearChart() : <p>Không có dữ liệu doanh thu theo năm.</p>}
                </>
            )}
        </div>
    );
};

export default BarChar;
