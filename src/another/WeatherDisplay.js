import React, { useState, useEffect } from 'react';
import './WeatherDisplay.css';

const WeatherDisplay = () => {
    const [position, setPosition] = useState(null);
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [locationName, setLocationName] = useState('');
    const [adImage, setAdImage] = useState('/1.jpg');
    const [weatherIcon, setWeatherIcon] = useState('/cloudy.png'); // Biểu tượng thời tiết mặc định
    const [productSuggestions, setProductSuggestions] = useState([]);
    const [isLocationDenied, setIsLocationDenied] = useState(false); // Trạng thái từ chối truy cập vị trí

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
            },
            (err) => {
                console.error('Geolocation error:', err);
                if (err.code === err.PERMISSION_DENIED) {
                    setIsLocationDenied(true); // Thiết lập từ chối truy cập vị trí
                }
            },
            { enableHighAccuracy: true }
        );
    }, []);

    useEffect(() => {
        if (position) {
            const weatherApiKey = 'c49684376d4ac78593a2e3c54dea6b8f';
            const geocodeApiKey = 'b7b1fb0e3519407e995d5b6d34273a59'; // Thay bằng API key của bạn từ OpenCage

            const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${weatherApiKey}&units=metric`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.latitude}&lon=${position.longitude}&appid=${weatherApiKey}&units=metric`;
            const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${position.latitude}+${position.longitude}&key=${geocodeApiKey}`;

            fetch(currentWeatherUrl)
            .then((response) => response.json())
            .then((data) => {
                console.log("dữ liệu thời tiết:", data); // Đặt console.log bên ngoài
        
                setWeather({
                    temperature: data.main.temp,
                    minTemp: data.main.temp_min,
                    maxTemp: data.main.temp_max,
                    description: data.weather[0].description,
                });
        
                determineWeatherType(data.main.temp, data.weather[0].description);
            })
            .catch((error) => console.error('Error fetching current weather:', error));
        

            fetch(forecastUrl)
                .then((response) => response.json())
                .then((data) => {
                    const dailyForecast = data.list.filter((_, index) => index % 8 === 0);
                    setForecast(dailyForecast);
                    console.log("dữ liệu dự báo thời tiết:", data);

                })
                .catch((error) => console.error('Error fetching forecast:', error));

            fetch(geocodeUrl)
                .then((response) => response.json())
                .then((data) => {
                    const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village;
                    const country = data.results[0].components.country;
                    setLocationName(`${city}, ${country}`);
                })
                .catch((error) => console.error('Error fetching location name:', error));
        }
    }, [position]);

    // Hàm để xác định loại thời tiết và thiết lập icon, hình ảnh quảng cáo, gợi ý sản phẩm
    const determineWeatherType = (temperature, description) => {
        let products = [];
        if (temperature > 30) {
            setWeatherIcon('/hot.png'); // Biểu tượng cho trời nóng
            setAdImage('/1.jpg');

        } else if (temperature >= 20 && temperature <= 30) {
            setWeatherIcon('/cloudy.png'); // Biểu tượng cho trời mát
            setAdImage('/2.jpg');

        } else if (temperature < 20) {
            setWeatherIcon('/cold.png'); // Biểu tượng cho trời lạnh
            setAdImage('/3.jpg');

        }

        if (description.includes('rain') || description.includes('drizzle')) {
            setWeatherIcon('/raining.png'); // Biểu tượng cho trời mưa
            setAdImage('/4.jpg');
        }

        setProductSuggestions(products);
    };

    // Chỉ hiển thị component nếu người dùng cho phép truy cập vị trí
    if (isLocationDenied) {
        return <></>
    }

    return (
        <div className="weather-container">
            {weather ? (
                <div className="weather-info">
                    <div className="current-weather">
                        <div className="location">
                            <img
                                src="/map.png"
                                alt="Location Icon"
                                className="location-icon"
                            />
                            <h2>{locationName}</h2>
                        </div>
                        <h3>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                        <div className="temperature">
                            <img
                                src={weatherIcon}
                                alt={weather.description}
                                className="weather-type-icon"
                            />
                            <h1>{Math.round(weather.temperature)}°C</h1>
                        </div>
                        <p>{weather.description}</p>
                        <p>Max: {Math.round(weather.maxTemp)}°C | Min: {Math.round(weather.minTemp)}°C</p>
                    </div>
                    
                    <div className="forecast">
                        {forecast.map((day, index) => (
                            <div key={index} className="forecast-day">
                                <h4>{new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</h4>
                                <img
                                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                                    alt={day.weather[0].description}
                                />
                                <p>{Math.round(day.main.temp)}°C</p>
                            </div>
                        ))}
                    </div>

                    <div className="ad-section">
                        <img src={adImage} alt="Weather Ad" className="ad-image" />

                    </div>
                </div>
            ) : (
                <p>Đang lấy dữ liệu thời tiết...</p>
            )}
        </div>
    );
};

export default WeatherDisplay;
