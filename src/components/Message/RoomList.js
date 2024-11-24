import React, { useEffect, useState, useRef, useCallback } from 'react';
import { List, ListItem, ListItemText, Avatar, Badge } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useSelector } from 'react-redux'; 
import MessageService from '../../services/MessageService';
import UserService from '../../services/UserService';
import './RoomList.css';


const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    bottom: '5px', // Dịch lên trên 1px bằng cách tăng giá trị bottom
    right: '8px',  // Dịch sang trái 4px bằng cách tăng giá trị right
  },
}))(Badge);



const RoomList = ({ onRoomSelect }) => {
  const [rooms, setRooms] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const stompClient = useRef(null);
  const userID = useSelector(state => state.auth.userID);

  const fetchRoomData = useCallback(async () => {
    if (!userID) return;
    try {
      const messageResponse = await MessageService.getLatestMessagesForAllRooms(userID);
      const roomsWithUsers = await Promise.all(
        messageResponse.data.map(async (room) => {
          const chatMessage = room.chatMessage;
          if (!chatMessage.roomId) return { ...room, user: null };

          try {
            const userResponse = await UserService.getUserById(chatMessage.roomId);
            const user = userResponse.data;
            return { ...room, user: user || {} };
          } catch (error) {
            console.error(`Error fetching user for room ${chatMessage.roomId}:`, error);
            return { ...room, user: null };
          }
        })
      );

      const sortedRooms = roomsWithUsers.sort((a, b) => {
        const dateA = new Date(a.chatMessage.createdAt);
        const dateB = new Date(b.chatMessage.createdAt);
        return dateB - dateA;
      });

      setRooms(sortedRooms);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  }, [userID]);

  const fetchOnlineUsers = useCallback(() => {
    MessageService.getOnlineStatus().then((response) => {
      setOnlineUserIds(response.data); // Cập nhật danh sách userId online
    }).catch((error) => {
      console.error('Error fetching online users:', error);
    });
  }, []);

  useEffect(() => {
    fetchRoomData();
    fetchOnlineUsers(); // Lấy danh sách userId đang online
    initializeWebSocket();
  }, [fetchRoomData, fetchOnlineUsers]);

  const initializeWebSocket = useCallback(() => {
    const socket = new SockJS('http://localhost:6010/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: console.log,
      onConnect: () => {
        client.subscribe(`/topic/latestMessages/${userID}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setRooms((prevRooms) => {
            const updatedRooms = prevRooms.map((room) => 
              room.chatMessage.roomId === receivedMessage.chatMessage.roomId 
                ? { ...room, chatMessage: { ...room.chatMessage, text: receivedMessage.chatMessage.text, createdAt: receivedMessage.chatMessage.createdAt }, unreadCount: receivedMessage.unreadCount }
                : room
            );
            return updatedRooms.sort((a, b) => {
              const dateA = new Date(a.chatMessage.createdAt);
              const dateB = new Date(b.chatMessage.createdAt);
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

  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId);
    onRoomSelect(roomId);
  };

  return (
    <List className="room-list">
      {rooms.map((room) => (
        <ListItem 
          button 
          key={room.chatMessage.roomId} 
          onClick={() => handleRoomSelect(room.chatMessage.roomId)}
          disabled={!room.user}
          className={`room-list-item ${selectedRoomId === room.chatMessage.roomId ? 'selected-room' : ''}`}
        >
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            invisible={!onlineUserIds.includes(room.chatMessage.roomId)}
          >
            <Avatar 
              className="room-avatar"
              src={room.user && room.user.picture ? `http://localhost:8080${room.user.picture}` : null} 
            >
              {room.user && room.user.username ? 
                room.user.username.charAt(0) : 
                '?'}
            </Avatar>
          </StyledBadge>
          <ListItemText 
            primary={room.user && room.user.username ? 
              room.user.username : 
              'Unknown User'}
            secondary={
              <div className="message-and-unread">
                <span className="MuiListItemText-secondary">{room.chatMessage.text}</span>
                {room.unreadCount > 0 && (
                  <span className="unread-count-badge">
                    {room.unreadCount}
                    </span>
                )}
              </div>
            }
            className="room-info"
          />
          {onlineUserIds.includes(room.chatMessage.roomId) && (
            <span className="online-status">Đang online</span>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default RoomList;
