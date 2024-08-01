import React, { useState } from 'react';
import UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        roles: 'USER'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await UserService.registerUser(user);
            alert('User registered successfully');
            navigate('/userList');
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Failed to register user');
        }
    };

    return (
        <div>
            <h2>Register User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input type="text" name="username" value={user.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={user.password} onChange={handleChange} required />
                </div>
                <div>
                    <label>First Name</label>
                    <input type="text" name="firstName" value={user.firstName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={user.lastName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Phone Number</label>
                    <input type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} required />
                </div>
                <div>
                    <label>Roles</label>
                    <input type="text" name="roles" value={user.roles} onChange={handleChange} required />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default AddUser;
