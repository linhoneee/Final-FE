import React from 'react';
import './Footer.css'; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <h3>LEARN TO RIDE</h3>
                    <ul>
                        <li><a href="#">Motorcycle Training</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>CUSTOMER SUPPORT</h3>
                    <ul>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Offers</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>FINANCING</h3>
                    <ul>
                        <li><a href="#">Apply for Credit</a></li>
                        <li><a href="#">Payment Estimator</a></li>
                        <li><a href="#">Financial Services</a></li>
                        <li><a href="#">Motorcycle Financing</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>MOTORCYCLE SERVICES</h3>
                    <ul>
                        <li><a href="#">Owner’s Manuals</a></li>
                        <li><a href="#">Maintenance Schedules</a></li>
                        <li><a href="#">Authorized Service</a></li>
                        <li><a href="#">Software Updates</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>INSURANCE</h3>
                    <ul>
                        <li><a href="#">Insurance Services</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>ABOUT US</h3>
                    <ul>
                        <li><a href="#">Our Company</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Investors</a></li>
                        <li><a href="#">Sustainability</a></li>
                        <li><a href="#">Become a Dealer</a></li>
                        <li><a href="#">Factory Tours</a></li>
                        <li><a href="#">Museum</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <ul className="footer-bottom-links">
                    <li><a href="#">Sitemap</a></li>
                    <li><a href="#">Disclaimers</a></li>
                    <li><a href="#">Legal Notice</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Cookie Policy</a></li>
                    <li><a href="#">Manage Cookie Preferences</a></li>
                    <li><a href="#">We Care About You</a></li>
                </ul>
                <div className="footer-social">
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-youtube"></i></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
