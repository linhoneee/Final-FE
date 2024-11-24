import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './WeatherDisplay.css';

const WeatherDisplay = () => {
    const [position, setPosition] = useState(null);
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [locationName, setLocationName] = useState('');
    const [translatedDescription, setTranslatedDescription] = useState(''); // Mô tả thời tiết đã dịch
    const [adImage, setAdImage] = useState('/1.jpg');
    const [weatherIcon, setWeatherIcon] = useState('/cloudy.png'); // Biểu tượng thời tiết mặc định
    const [isLocationDenied, setIsLocationDenied] = useState(false); // Trạng thái từ chối truy cập vị trí

    // Lấy thông tin roles từ Redux store
    const roles = useSelector((state) => state.auth.roles);

    //Cloud Translation API
    const translateAPIKey = 'AIzaSyBIgjNBgqXMJGSgo_zH75tzhm-2_AAshSc';

    useEffect(() => {
        if (roles === 'ADMIN') return; // Ngừng thực hiện nếu roles là ADMIN

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
    }, [roles]);

    useEffect(() => {
        if (!position || roles === 'ADMIN') return; // Ngừng thực hiện nếu roles là ADMIN

        const weatherApiKey = 'c49684376d4ac78593a2e3c54dea6b8f';
        const geocodeApiKey = 'b7b1fb0e3519407e995d5b6d34273a59';

        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${weatherApiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.latitude}&lon=${position.longitude}&appid=${weatherApiKey}&units=metric`;
        const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${position.latitude}+${position.longitude}&key=${geocodeApiKey}`;

        fetch(currentWeatherUrl)
            .then((response) => response.json())
            .then(async (data) => {
                const translatedDescription = await translateDescription(data.weather[0].description);
                setWeather({
                    temperature: data.main.temp,
                    minTemp: data.main.temp_min,
                    maxTemp: data.main.temp_max,
                    description: translatedDescription, // Mô tả đã dịch
                });

                determineWeatherType(data.main.temp, data.weather[0].description);
            })
            .catch((error) => console.error('Error fetching current weather:', error));

        fetch(forecastUrl)
            .then((response) => response.json())
            .then((data) => {
                const dailyForecast = data.list.filter((_, index) => index % 8 === 0).slice(1, 5);
                setForecast(dailyForecast);
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
    }, [position, roles]);

    const determineWeatherType = (temperature, description) => {
        if (temperature > 30) {
            setWeatherIcon('/hot.png'); // Biểu tượng cho trời nóng
            setAdImage('/hot.jpg');
        } else if (temperature >= 20 && temperature <= 30) {
            setWeatherIcon('/cloudy.png'); // Biểu tượng cho trời mát
            setAdImage('/cloudy.jpg');
        } else if (temperature < 20) {
            setWeatherIcon('/cold.png'); // Biểu tượng cho trời lạnh
            setAdImage('/cold.jpg');
        }

        if (description.includes('rain') || description.includes('drizzle')) {
            setWeatherIcon('/raining.png'); // Biểu tượng cho trời mưa
            setAdImage('/rain.jpg');
        }
    };

    const translateDescription = async (description) => {
        const translateURL = `https://translation.googleapis.com/language/translate/v2?key=${translateAPIKey}`;

        const body = {
            q: description,
            target: 'vi', // Dịch sang tiếng Việt
            source: 'en', // Ngôn ngữ nguồn là tiếng Anh
        };

        try {
            const response = await fetch(translateURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            return data.data.translations[0].translatedText; // Trả về mô tả đã dịch
        } catch (error) {
            console.error('Error translating description:', error);
            return description; // Nếu lỗi, giữ nguyên mô tả gốc
        }
    };

    if (roles === 'ADMIN') {
        return null;
    }

    if (isLocationDenied) {
        return null;
    }

    return (
        <div className="main-container">
            <div className="weather-container">
                {weather ? (
                    <div className="weather-info">
                        <div className="current-weather">
                            <div className="location">
                                <img src="/map.png" alt="Location Icon" className="location-icon" />
                                <h2>{locationName}</h2>
                            </div>
                            <h3>
                                {new Date().toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </h3>
                            <div className="temperature">
                                <img src={weatherIcon} alt={weather.description} className="weather-type-icon" />
                                <h1>{Math.round(weather.temperature)}°C</h1>
                            </div>
                            <p>{weather.description}</p>
                        </div>

                        <div className="forecast">
                            {forecast.map((day, index) => (
                                <div key={index} className="forecast-day">
                                    <h4>{new Date(day.dt_txt).toLocaleDateString('vi-VN', { weekday: 'short' })}</h4>
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
        </div>
    );
};

export default WeatherDisplay;
