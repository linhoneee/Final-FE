import React from 'react';
import './ImageGallery.css'; // Import file CSS để định dạng

const ImageGallery = () => {
    const images = [
        { src: '/1.jpg', title: 'STREET GLIDE™', description: 'Equipped with the Milwaukee-Eight™ 117 engine, the 2024 Street Glide delivers more displacement, torque, and horsepower than ever before.', linkText: 'SEE THE BIKE' },
        { src: '/2.jpg', title: 'HERITAGE CLASSIC', description: 'A quintessential American cruiser, the 2024 Heritage Classic 114 has showstopping vintage details and pure rock ‘n’ roll style.', linkText: 'SEE THE BIKE' },
        { src: '/3.jpg', title: 'PAN AMERICA™ 1250 SPECIAL', description: 'Designed for both on- and off-road Adventure Touring, the Pan America1250 Special is engineered to explore and endure.', linkText: 'SEE THE BIKE' }
    ];

    return (
        <div className="gallery-container">
            <h2>Explore the 2024 motorcycle lineup</h2>
            <div className="gallery">
                {images.map((image, index) => (
                    <div className="gallery-item" key={index}>
                        <img src={image.src} alt={image.title} />
                        <div className="gallery-text">
                            <h3>{image.title}</h3>
                            <p>{image.description}</p>
                            <a href="#">{image.linkText} &#8594;</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
