import React, { useState, useEffect, useCallback } from 'react';
import './ImageSlider.css';

const ImageSlider = () => {
    const slides = [
        {
            src: '/11.png',

        },
        {
            src: '/12.png',

        },
        {
            src: '/13.png',

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
                <img src={slides[currentImageIndex].src} alt="Poster" className="image-slice" />

                <div className="progress-bar">
                    <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <button className="nextButton" onClick={nextImage}>&#62;</button>
        </div>
    );
};

export default ImageSlider;
