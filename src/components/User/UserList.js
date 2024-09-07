import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

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
            fetchUsers(); // Refresh the user list after deletion
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const blockUser = async (id) => {
        try {
            await UserService.blockUser(id);
            fetchUsers(); // Refresh the user list after blocking/unblocking
        } catch (error) {
            console.error('Failed to block/unblock user:', error);
        }
    };

    const viewUserDetails = (id) => {
        navigate(`/userDetails/${id}`);
    };

    return (
        <div>
            <h2>Users List</h2>
            <button onClick={addUser}>Add User</button>
            <table>
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
                                <button onClick={() => editUser(user.id)}>Edit</button>
                                <button onClick={() => deleteUser(user.id)}>Delete</button>
                                <button onClick={() => blockUser(user.id)}>
                                    {user.blocked ? 'Unblock' : 'Block'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
