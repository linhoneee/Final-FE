import React, { useEffect, useState, useRef, useCallback } from 'react';
import { List, ListItem, ListItemText, Avatar, Badge } from '@material-ui/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useSelector } from 'react-redux'; 
import MessageService from '../../services/MessageService';
import UserService from '../../services/UserService';
import './RoomList.css';

const RoomList = ({ onRoomSelect }) => {
  const [rooms, setRooms] = useState([]);
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

          if (!chatMessage.roomId) {
            console.error('Room ID is undefined for room:', room);
            return { ...room, user: null };
          }

          try {
            const userResponse = await UserService.getUserById(chatMessage.roomId);
            const user = userResponse.data;
            return {
              ...room,
              user: user || {},
            };
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

  useEffect(() => {
    fetchRoomData();
    initializeWebSocket();
  }, [fetchRoomData, initializeWebSocket]);

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
            secondary={
              <>
                {room.chatMessage.text}
                {room.unreadCount > 0 && (
                  <Badge badgeContent={room.unreadCount} color="secondary" className="unread-count-badge" />
                )}
              </>
            }
            className="room-info"
          />
        </ListItem>
      ))}
    </List>
  );
};

export default RoomList;
