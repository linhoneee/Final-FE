import React, { useState, useEffect, useCallback } from 'react';
import './ImageSlider.css';  // Import file CSS

const ImageSlider = () => {
    const slides = [
        {
            src: '/1.jpg',
            title: '2024 YEAR-END EVENT',
            description: 'Visit your local dealer to celebrate another great riding season.',
        },
        {
            src: '/2.jpg',
            title: 'HERITAGE CLASSIC',
            description: 'A quintessential American cruiser with vintage details and pure rock ‘n’ roll style.',
        },
        {
            src: '/3.jpg',
            title: 'PAN AMERICA™ 1250 SPECIAL',
            description: 'Designed for on- and off-road adventure touring, engineered to explore and endure.',
        }
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [progress, setProgress] = useState(0); // State để theo dõi thanh tiến trình

    // Sử dụng useCallback để ổn định hàm
    const nextImage = useCallback(() => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
        setProgress(0); // Reset thanh tiến trình mỗi khi chuyển ảnh
    }, [slides.length]);

    const prevImage = useCallback(() => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
        setProgress(0); // Reset thanh tiến trình khi người dùng chuyển ảnh thủ công
    }, [slides.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => (prev >= 100 ? 0 : prev + 1)); // Cập nhật thanh tiến trình
            if (progress >= 100) nextImage(); // Chuyển ảnh khi thanh tiến trình đạt 100%
        }, 40); // Tốc độ cập nhật thanh tiến trình để hoàn thành sau 4 giây

        return () => clearInterval(interval); // Xóa interval khi component unmount
    }, [progress, nextImage]);

    return (
        <div className="slider">
            <button className="prevButton" onClick={prevImage}>
                &#60;
            </button>
            <div className="slide">
                <img src={slides[currentImageIndex].src} alt="Poster" className="image" />
                <div className="text-overlay">
                    <h2>{slides[currentImageIndex].title}</h2>
                    <p>{slides[currentImageIndex].description}</p>
                </div>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <button className="nextButton" onClick={nextImage}>
                &#62;
            </button>
        </div>
    );
};

export default ImageSlider;
