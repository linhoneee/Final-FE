import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import './UserList.css';
import AddUser from "./AddUser";
const UserList = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await UserService.getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const addUser = () => {
        navigate('/addUser');
    };

    const editUser = (id) => {
        navigate(`/updateUser/${id}`);
    };

    const deleteUser = async (id) => {
        try {
            await UserService.deleteUser(id);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const blockUser = async (id) => {
        try {
            await UserService.blockUser(id);
            fetchUsers();
        } catch (error) {
            console.error('Failed to block/unblock user:', error);
        }
    };

    const viewUserDetails = (id) => {
        navigate(`/userDetails/${id}`);
    };

    return (
        <div className="user-list-container">
            <h2 className="user-list-title">Users List</h2>
            <button onClick={() => setShowAddModal(true)} className="category-list-btn category-list-btn-primary">Add user</button>
            <table className="user-list-table user-list-table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                        <th>Roles</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td onClick={() => viewUserDetails(user.id)}>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.roles}</td>
                            <td>{user.blocked ? 'Blocked' : 'Active'}</td>
                            <td>
                                <button onClick={() => editUser(user.id)} className="user-list-btn user-list-btn-info">Edit</button>
                                <button onClick={() => deleteUser(user.id)} className="user-list-btn user-list-btn-danger">Delete</button>
                                <button onClick={() => blockUser(user.id)} className="user-list-btn user-list-btn-info">
                                    {user.blocked ? 'Unblock' : 'Block'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showAddModal && <AddUser onClose={() => setShowAddModal(false)} />}

        </div>
    );
};

export default UserList;
