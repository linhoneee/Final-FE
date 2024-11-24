import React from 'react';
import './Footer.css'; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <h3>SẢN PHẨM</h3>
                    <ul>
                        <li><a href="#">Tivi</a></li>
                        <li><a href="#">Tủ lạnh</a></li>
                        <li><a href="#">Điều hòa</a></li>
                        <li><a href="#">Máy giặt</a></li>
                        <li><a href="#">Máy nước nóng</a></li>
                        <li><a href="#">Các sản phẩm khác</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>DỊCH VỤ & BẢO HÀNH</h3>
                    <ul>
                        <li><a href="#">Hướng dẫn sử dụng</a></li>
                        <li><a href="#">Chính sách bảo hành</a></li>
                        <li><a href="#">Hỗ trợ kỹ thuật</a></li>
                        <li><a href="#">Sửa chữa sản phẩm</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>CHÍNH SÁCH HỖ TRỢ</h3>
                    <ul>
                        <li><a href="#">Hướng dẫn mua hàng</a></li>
                        <li><a href="#">Chính sách đổi trả</a></li>
                        <li><a href="#">Chính sách giao hàng</a></li>
                        <li><a href="#">Chính sách trả góp</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>HỖ TRỢ KHÁCH HÀNG</h3>
                    <ul>
                        <li><a href="#">Liên hệ</a></li>
                        <li><a href="#">Tổng đài hỗ trợ</a></li>
                        <li><a href="#">Câu hỏi thường gặp</a></li>
                        <li><a href="#">Tư vấn mua sắm</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>VỀ CHÚNG TÔI</h3>
                    <ul>
                        <li><a href="#">Giới thiệu</a></li>
                        <li><a href="#">Hệ thống cửa hàng</a></li>
                        <li><a href="#">Tuyển dụng</a></li>
                        <li><a href="#">Đối tác kinh doanh</a></li>
                        <li><a href="#">Liên hệ hợp tác</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <ul className="footer-bottom-links">
                    <li><a href="#">Sơ đồ trang</a></li>
                    <li><a href="#">Thông báo pháp lý</a></li>
                    <li><a href="#">Chính sách bảo mật</a></li>
                    <li><a href="#">Chính sách cookie</a></li>
                    <li><a href="#">Quản lý cookie</a></li>
                </ul>
                <div className="footer-social">
                    <a href="#" aria-label="Facebook">F</a>
                    <a href="#" aria-label="TikTok">T</a>
                    <a href="#" aria-label="YouTube">Y</a>
                    <a href="#" aria-label="Instagram">I</a>
                    <a href="#" aria-label="Twitter">W</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
