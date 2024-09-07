import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useSelector } from 'react-redux';
import MessageService from '../../services/MessageService';
import UserService from '../../services/UserService';
import './MessagesAdmin.css';

const MessageAdmin = ({ roomId, initialMessages = [] }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState('');
  const [userAvatars, setUserAvatars] = useState({});
  const [roomUser, setRoomUser] = useState(null);
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  const username = useSelector((state) => state.auth.username) || 'Unknown';
  const userID = String(useSelector((state) => state.auth.userID)); 

  const fetchRoomUser = useCallback(async () => {
    if (!roomId) return;
    try {
      const response = await UserService.getUserById(roomId);
      setRoomUser(response.data);
    } catch (error) {
      console.error('Failed to fetch room user data:', error);
    }
  }, [roomId]);


  const initializeWebSocketAndMessages = useCallback(() => {
    if (!roomId) return;

    const socket = new SockJS('http://localhost:6010/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: console.log,
      onConnect: () => {
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      }
    });

    client.activate();
    stompClient.current = client;

    MessageService.getMessagesByRoomId(roomId)
      .then(async response => {
        const messages = response.data;
        setMessages(messages);
        const avatars = await fetchUserAvatars(messages);
        setUserAvatars(avatars);
      })
      .catch(console.error);

    return () => {
      client.deactivate();
    };
  }, [roomId]);

  const fetchUserAvatars = async (messages) => {
    const avatars = {};
    for (const msg of messages) {
      //Ta sẽ cần kiểm tra xem đã có avatar của userid trong đối tượng vừa tạo chưa, nếu chưa thì thêm vào 
      if (!avatars[msg.userId]) {
        try {
          const userResponse = await UserService.getUserById(msg.userId);
          //Thêm một key (khóa) là userId vào đối tượng avatars
          avatars[msg.userId] = userResponse.data.picture ? `http://localhost:8080${userResponse.data.picture}` : null;
        } catch (error) {
          console.error(`Failed to fetch avatar for user ${msg.userId}:`, error);
        }
      }
    }
    return avatars;
  };

  // Hàm cuộn xuống cuối danh sách tin nhắn
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (message.trim() && username.trim() && userID) {
      const chatMessage = {
        text: message,
        username: username,
        role: 'USER',
        userId: userID,
        roomId: roomId,
        unRead: true,
      };

      stompClient.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage)
      });

      setMessage('');
    }
  };

  useEffect(() => {
    fetchRoomUser();
    initializeWebSocketAndMessages();
    scrollToBottom(); 
  }, [fetchRoomUser, initializeWebSocketAndMessages]);

  // Cuộn xuống cuối danh sách tin nhắn khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderRoomUserInfo = useMemo(() => (
    roomUser && (
      <div className="message-admin-room-user-info">
        <Avatar className="message-admin-room-user-avatar" src={roomUser.picture ? `http://localhost:8080${roomUser.picture}` : null}>
          {roomUser.username?.charAt(0) || '?'}
        </Avatar>
        <Typography variant="h6" className="message-admin-room-user-name">
          {roomUser.username || 'Unknown User'}
        </Typography>
      </div>
    )
  ), [roomUser]);

  const renderMessages = useMemo(() => (
    <List className="message-admin-custom-messages-list">
      {messages.map((msg, index) => (
        <ListItem
          key={index}
          className={`message-admin-custom-message-item ${String(msg.userId) === userID ? 'message-admin-custom-message-right' : 'message-admin-custom-message-left'}`}
        >
          <ListItemAvatar className="message-admin-custom-avatar">
            <Avatar className="message-admin-custom-message-avatar"
              src={userAvatars[msg.userId] || null}
            >
              {userAvatars[msg.userId] ? null : (msg.username?.charAt(0) || '?')}
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primary={
              <>
                <Typography variant="subtitle1" className={`message-admin-custom-message-username ${String(msg.userId) === userID ? 'message-admin-custom-message-info-right' : ''}`}>
                  {msg.username || 'Unknown'}
                </Typography>
                <Typography component="span" variant="body2" className={`message-admin-custom-message-text ${String(msg.userId) === userID ? 'message-admin-custom-message-info-right' : ''}`}>
                  {msg.text}
                </Typography>
                <Typography component="span" variant="caption" className={`message-admin-custom-message-time ${String(msg.userId) === userID ? 'message-admin-custom-message-time-right' : ''}`}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : 'Invalid Date'}
                </Typography>
              </>
            }
            className="message-admin-custom-message-text-container"
          />
        </ListItem>
      ))}
      <div ref={messagesEndRef} />
    </List>
  ), [messages, userAvatars, userID]);

  return (
    <div className="message-admin-container">
      {renderRoomUserInfo}
      {renderMessages}
      <div className="message-admin-custom-message-input-container">
        <TextField
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          className="message-admin-custom-message-input"
        />
        <IconButton onClick={handleSendMessage} disabled={!message.trim()} className="message-admin-custom-message-send-button">
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default MessageAdmin;
