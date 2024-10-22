import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '../another/ImageSlider';
import Footer from '../another/Footer';
import ImageGallery from '../another/ImageGallery';
import StoreMap from '../another/StoreMap';
import RecentlyViewedProducts from '../another/RecentlyViewedProducts';
// import MatomoDashboard from '../another/MatomoDashboard';
import BarChar from '../another/BarChart';
import MapChart from '../another/MapChart';
import SalesComponent from '../another/SalesComponent';
const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const username = params.get('username');
        const email = params.get('email');
        const roles = params.get('roles');
        const userID = params.get('userID');

        if (token && username && email && roles && userID) {
            // Log the received response
            console.log('Received response:', {
                token,
                username,
                email,
                roles,
                userID,
            });

            // Store data in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);
            localStorage.setItem('roles', roles);
            localStorage.setItem('userID', userID);

            // Dispatch login action
            dispatch(login(token, email, username, roles, userID));

            // Redirect to the main page
            navigate('/');
        } else {
            // Handle the case where the required parameters are missing
            console.error('Missing required parameters in URL');
        }
    }, [dispatch, navigate]);

    return (
        <div className="content-wrapper">
            <h1>Welcome to Home</h1>
            <ImageSlider />
            <ImageGallery />
            <RecentlyViewedProducts />
            <StoreMap />
            <Footer /> 
            {/* <MatomoDashboard /> */}
            <BarChar />
            <MapChart />
            <SalesComponent />
        </div>
    );
};

export default Home;