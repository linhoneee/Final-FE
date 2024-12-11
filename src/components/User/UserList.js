import React, { useState, useEffect } from 'react';
import UserService from '../../services/UserService';
import './UserList.css';
import AddUser from './AddUser';
import UpdateUser from './UpdateUser';
import showGeneralToast from '../toastUtils/showGeneralToast'; 

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
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa người dùng này?");
    if (confirmDelete) {
      try {
        await UserService.deleteUser(id);
        fetchUsers();
  
        showGeneralToast("Người dùng đã được xóa thành công!", "success");
      } catch (error) {
        console.error('Failed to delete user:', error);
  
        if (error.response && error.response.data) {
          const { message } = error.response.data;
          showGeneralToast(message, "error");
        } else {
          showGeneralToast("Có lỗi xảy ra khi xóa người dùng", "error");
        }
      }
    }
  };
  const blockUser = async (id) => {
    try {
      await UserService.blockUser(id);
      fetchUsers();
  
      showGeneralToast("Chặn hoặc bỏ chặn thành công!", "success");
    } catch (error) {
      console.error('Failed to block/unblock user:', error);
  
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        showGeneralToast(message, "error");
      } else {
        showGeneralToast("Có lỗi xảy ra khi chặn hoặc bỏ chặn người dùng", "error");
      }
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
      <h2 className="user-list-title">Danh Sách Người Dùng</h2>
      <button
        onClick={() => setShowAddModal(true)}
        className="category-list-btn category-list-btn-primary"
      >
        Thêm người dùng
      </button>
      <table className="user-list-table user-list-table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
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
                {user.blocked ? 'Bị Chặn' : 'Hoạt Động'}
              </td>
              <td>
                <button
                  onClick={() => openEditModal(user)}
                  className="user-list-btn user-list-btn-info"
                >
                  Cập Nhật
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="user-list-btn user-list-btn-danger"
                >
                  Xóa
                </button>
                <button
                  onClick={() => blockUser(user.id)}
                  className="user-list-btn user-list-btn-info"
                >
                  {user.blocked ? 'Bỏ Chặn' : 'Chặn'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddModal && (
        <AddUser onClose={() => setShowAddModal(false)} fetchUsers={fetchUsers} />
      )}
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
