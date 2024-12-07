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
// import WeatherDisplay from '../another/WeatherDisplay';

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


            // Dispatch login action
            dispatch(login(token, email, username, roles, userID));

            // Redirect to the main page
            navigate('/');
        } 
    }, [dispatch, navigate]);

    return (
        <div className="content-wrapper">
            <h3></h3>
            <ImageSlider />
            <ImageGallery />
            <RecentlyViewedProducts />
            <StoreMap />
            <Footer /> 
            {/* <MatomoDashboard /> */}


            {/* <WeatherDisplay /> */}


        </div>
    );
};

export default Home;