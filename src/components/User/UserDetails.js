import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import AddressList from '../Address/AddressList'; // Import AddressList
import './UserDetails.css'; // Import the combined CSS file

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [picture, setPicture] = useState(null);

    const fetchUserDetails = useCallback(async () => {
        try {
            const response = await UserService.getUserById(id);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        }
    }, [id]);

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    const updateUserDetails = async (e) => {
        e.preventDefault(); 
        try {
            await UserService.updateUser(user, id);
            if (picture) {
                await UserService.updateUserPicture(id, picture);
            }
            navigate('/users'); 
        } catch (error) {
            console.error('Failed to update user details:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'day' || name === 'month' || name === 'year') {
            const date = new Date(user.birthday || new Date());
            if (name === 'day') date.setDate(value);
            if (name === 'month') date.setMonth(value - 1);
            if (name === 'year') date.setFullYear(value);
            setUser({ ...user, birthday: date.toISOString() });
        } else {
            setUser({ ...user, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setPicture(e.target.files[0]);
    };

    const handleGenderChange = (e) => {
        setUser({ ...user, genderId: parseInt(e.target.value) });
    };

    return (
        <div className="user-details-container">
            <h2>User Details</h2>
            <p>Manage profile information for account security</p>
            <form onSubmit={updateUserDetails} className="user-details-form">
                <div className="left-section">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={user.username || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={user.firstName || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={user.phoneNumber || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <div className="gender-options">
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="0"
                                    checked={user.genderId === 0}
                                    onChange={handleGenderChange}
                                />
                                Male
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="1"
                                    checked={user.genderId === 1}
                                    onChange={handleGenderChange}
                                />
                                Female
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="2"
                                    checked={user.genderId === 2}
                                    onChange={handleGenderChange}
                                />
                                Other
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Birthday</label>
                        <div className="birthday-options">
                            <select name="day" value={user.birthday ? new Date(user.birthday).getDate() : ''} onChange={handleInputChange}>
                                {[...Array(31).keys()].map(day => <option key={day + 1} value={day + 1}>{day + 1}</option>)}
                            </select>
                            <select name="month" value={user.birthday ? new Date(user.birthday).getMonth() + 1 : ''} onChange={handleInputChange}>
                                {[...Array(12).keys()].map(month => <option key={month + 1} value={month + 1}>Month {month + 1}</option>)}
                            </select>
                            <select name="year" value={user.birthday ? new Date(user.birthday).getFullYear() : ''} onChange={handleInputChange}>
                                {[...Array(100).keys()].map(year => <option key={1920 + year} value={1920 + year}>{1920 + year}</option>)}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="update-button">Save</button>
                </div>
                <div className="right-section">
                    <div className="form-group">
                        <label>Profile Picture</label>
                        {user.picture && (
                            <div className="user-picture">
                                <img src={`http://localhost:8080${user.picture}`} alt="User" />
                            </div>
                        )}
                        <input type="file" onChange={handleFileChange} className="file-input"/>
                        <button type="button" className="upload-button">Choose Picture</button>
                    </div>
                </div>
            </form>

            {/* Address List Section */}
            <div className="address-list-section">
                <AddressList /> {/* Render AddressList component here */}
            </div>
        </div>
    );
};

export default UserDetails;
