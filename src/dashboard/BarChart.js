import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, defs, linearGradient, stop } from 'recharts';
import OrderService from '../services/OrderService';
import './BarChart.css';

const BarChar = () => {
    const [monthData, setMonthData] = useState([]);
    const [yearData, setYearData] = useState([]);
    const [chartType, setChartType] = useState('month'); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const lastMonth = new Date(today);
                lastMonth.setMonth(today.getMonth() - 1);

                const lastYear = new Date(today);
                lastYear.setFullYear(today.getFullYear() - 1);

                const revenueThisMonth = await OrderService.getRevenueByDayOfMonth(today.getFullYear(), today.getMonth() + 1);
                const revenueLastMonth = await OrderService.getRevenueByDayOfMonth(lastMonth.getFullYear(), lastMonth.getMonth() + 1);

                const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                let monthComparison = [];
                for (let i = 1; i <= daysInCurrentMonth; i++) {
                    monthComparison.push({
                        name: `Ngày ${i}`,
                        'Tháng này': revenueThisMonth.data[i - 1] || 0,
                        'Tháng trước': revenueLastMonth.data[i - 1] || 0
                    });
                }
                setMonthData(monthComparison);

                const revenueThisYear = await OrderService.getRevenueByMonthOfYear(today.getFullYear());
                const revenueLastYear = await OrderService.getRevenueByMonthOfYear(lastYear.getFullYear());

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

    const renderGradient = () => (
        <defs>
            <linearGradient id="gradientThisPeriod" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#88d9b1" />
                <stop offset="100%" stopColor="#3a7765" />
            </linearGradient>
            <linearGradient id="gradientLastPeriod" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffa07a" />
                <stop offset="100%" stopColor="#d2691e" />
            </linearGradient>
        </defs>
    );

    const renderMonthChart = () => (
        <div className="chart-container">
            <h2 className="chart-header">Doanh thu theo tháng</h2>
            <ResponsiveContainer width="100%" height={230} className="responsive-bar-chart">
                <BarChart data={monthData}>
                    {renderGradient()}
                    <CartesianGrid className="grid" />
                    <XAxis dataKey="name" className="axis-text" />
                    <YAxis className="axis-text" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Tháng này" fill="url(#gradientThisPeriod)" className="bar-this-period" />
                    <Bar dataKey="Tháng trước" fill="url(#gradientLastPeriod)" className="bar-last-period" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    const renderYearChart = () => (
        <div className="chart-container">
            <h2 className="chart-header">Doanh thu theo năm</h2>
            <ResponsiveContainer width="100%" height={230} className="responsive-bar-chart">
                <BarChart data={yearData}>
                    {renderGradient()}
                    <CartesianGrid className="grid" />
                    <XAxis dataKey="name" className="axis-text" />
                    <YAxis className="axis-text" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Năm nay" fill="url(#gradientThisPeriod)"  className="bar-this-period" />
                    <Bar dataKey="Năm trước" fill="url(#gradientLastPeriod)" className="bar-last-period" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <div className="chart-buttons">
                <button 
                    onClick={() => setChartType('month')} 
                    className={`chart-button ${chartType === 'month' ? 'active' : ''}`}
                >
                    Doanh thu theo tháng
                </button>
                <button 
                    onClick={() => setChartType('year')} 
                    className={`chart-button ${chartType === 'year' ? 'active' : ''}`}
                >
                    Doanh thu theo năm
                </button>
            </div>

            {chartType === 'month' ? renderMonthChart() : renderYearChart()}
        </div>
    );
};

export default BarChar;
