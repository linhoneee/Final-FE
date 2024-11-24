import React, { useState, useEffect } from 'react';
import UserService from '../../services/UserService';
import './UserList.css';
import AddUser from './AddUser';
import UpdateUser from './UpdateUser';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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

    const openEditModal = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setSelectedUser(null);
        setShowEditModal(false);
    };

    return (
        <div className="user-list-container">
            <h2 className="user-list-title">Users List</h2>
            <button
                onClick={() => setShowAddModal(true)}
                className="category-list-btn category-list-btn-primary"
            >
                Add User
            </button>
            <table className="user-list-table user-list-table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Roles</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            className={user.blocked ? 'blocked-user-row' : ''}
                        >
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.roles}</td>
                            <td
                                style={{
                                    color: user.blocked ? 'red' : '#1b5e20',
                                    fontWeight: 'bold',
                                }}
                            >
                                {user.blocked ? 'Blocked' : 'Active'}
                            </td>
                            <td>
                                <button
                                    onClick={() => openEditModal(user)}
                                    className="user-list-btn user-list-btn-info"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="user-list-btn user-list-btn-danger"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => blockUser(user.id)}
                                    className="user-list-btn user-list-btn-info"
                                >
                                    {user.blocked ? 'Unblock' : 'Block'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showAddModal && <AddUser onClose={() => setShowAddModal(false)} />}
            {showEditModal && (
                <UpdateUser
                    user={selectedUser}
                    onClose={closeEditModal}
                    onUpdate={fetchUsers}
                />
            )}
        </div>
    );
};

export default UserList;
