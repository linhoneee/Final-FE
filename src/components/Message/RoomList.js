import React, { useEffect, useState, useRef, useCallback } from 'react';
import { List, ListItem, ListItemText, Avatar } from '@material-ui/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import MessageService from '../../services/MessageService';
import UserService from '../../services/UserService';
import './RoomList.css';

const RoomList = ({ onRoomSelect }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const stompClient = useRef(null);

  // Hàm fetch dữ liệu phòng và tin nhắn mới nhất
  const fetchRoomData = useCallback(async () => {
    try {
      const messageResponse = await MessageService.getLatestMessagesForAllRooms();

      const roomsWithUsers = await Promise.all(
        messageResponse.data.map(async (room) => {
          try {
            const userResponse = await UserService.getUserById(room.roomId);
            const user = userResponse.data;
            return {
              ...room,
              user: user || {},
            };
          } catch (error) {
            console.error(`Error fetching user for room ${room.roomId}:`, error);
            return { ...room, user: null };
          }
        })
      );

      const sortedRooms = roomsWithUsers.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });

      setRooms(sortedRooms);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  }, []);

  // Hàm khởi tạo kết nối WebSocket
  const initializeWebSocket = useCallback(() => {
    const socket = new SockJS('http://localhost:6010/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: console.log,
      onConnect: () => {
        client.subscribe('/topic/latestMessages', (message) => {
          const receivedMessage = JSON.parse(message.body);

          setRooms((prevRooms) => {
            // Cập nhật phòng có tin nhắn mới
            const updatedRooms = prevRooms.map((room) => 
              room.roomId === receivedMessage.roomId 
                ? { ...room, text: receivedMessage.text, createdAt: receivedMessage.createdAt } 
                : room
            );

            // Sắp xếp lại danh sách để phòng có tin nhắn mới nhất ở đầu
            return updatedRooms.sort((a, b) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              return dateB - dateA;
            });
          });
        });
      }
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  // Khởi tạo WebSocket và lấy dữ liệu phòng khi component mount
  useEffect(() => {
    fetchRoomData();
    initializeWebSocket();
  }, [fetchRoomData, initializeWebSocket]);

  // Xử lý khi chọn phòng
  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId);
    onRoomSelect(roomId);
  };

  return (
    <List className="room-list">
      {rooms.map((room) => (
        <ListItem 
          button 
          key={room.roomId} 
          onClick={() => handleRoomSelect(room.roomId)}
          disabled={!room.user}
          className={`room-list-item ${selectedRoomId === room.roomId ? 'selected-room' : ''}`}
        >
          <Avatar 
            className="room-avatar"
            src={room.user && room.user.picture ? `http://localhost:8080${room.user.picture}` : null} 
          >
            {room.user && room.user.username ? 
              room.user.username.charAt(0) : 
              '?'}
          </Avatar>
          <ListItemText 
            primary={room.user && room.user.username ? 
              room.user.username : 
              'Unknown User'}
            secondary={room.text}
            className="room-info"
          />
        </ListItem>
      ))}
    </List>
  );
};

export default RoomList;
