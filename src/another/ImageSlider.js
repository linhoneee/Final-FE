import React, { useState, useEffect, useCallback } from 'react';
import './ImageSlider.css';

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
    const [progress, setProgress] = useState(0);

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
        setProgress(0);
    }, [slides.length]);

    const prevImage = useCallback(() => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
        setProgress(0);
    }, [slides.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    nextImage();
                    return 0;
                }
                return prev + 0.5;
            });
        }, 20); // Cập nhật nhanh để thanh tiến trình mượt hơn

        return () => clearInterval(interval);
    }, [progress, nextImage]);

    return (
        <div className="slider">
            <button className="prevButton" onClick={prevImage}>&#60;</button>
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
            <button className="nextButton" onClick={nextImage}>&#62;</button>
        </div>
    );
};

export default ImageSlider;
