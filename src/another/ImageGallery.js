import React from 'react';
import './ImageGallery.css'; // Import file CSS để định dạng

const ImageGallery = () => {
    const images = [
        { src: '/111.jpg', title: 'SẢN PHẨM A', description: 'Động cơ mạnh mẽ, thiết kế hiện đại. Dành cho những ai yêu thích tốc độ và phong cách cá nhân.', linkText: 'XEM CHI TIẾT' },
        { src: '/222.png', title: 'SẢN PHẨM B', description: 'Phong cách cổ điển kết hợp với sự tinh tế. Một lựa chọn hoàn hảo cho những người yêu thích sự hoài niệm.', linkText: 'XEM CHI TIẾT' },
        { src: '/333.png', title: 'SẢN PHẨM C', description: 'Được thiết kế để khám phá mọi hành trình. Đảm bảo độ bền và hiệu suất vượt trội.', linkText: 'XEM CHI TIẾT' }
    ];

    return (
        <div className="gallery-container">
            <h2>Khám phá các sản phẩm nổi bật 2024</h2>
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
