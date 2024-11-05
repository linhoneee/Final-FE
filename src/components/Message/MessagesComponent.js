import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useSelector } from 'react-redux';
import MessageService from '../../services/MessageService';
import './MessagesComponent.css';
import showCustomToast from './showCustomToast';

const MessagesComponent = ({ open, onClose, initialMessages }) => {
  const userID = useSelector((state) => state.auth.userID);
  const roomId = userID;

  const [messages, setMessages] = useState(initialMessages || []);
  const [message, setMessage] = useState('');
  const stompClient = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const username = useSelector((state) => state.auth.username) || 'Unknown';

  // Đăng ký Service Worker khi component mount
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }, []);
  
  // Kiểm tra và xin phép quyền thông báo khi khởi động
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      }).catch(error => console.error("Failed to request permission:", error));
    }
  }, []);
  
  useEffect(() => {
    if (!roomId) {
      console.error('Room ID is undefined');
      return;
    }

    const socket = new SockJS('http://localhost:6010/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: console.log,
      onConnect: () => {
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);

          if (open) {
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          } else if (document.visibilityState === 'visible') {
            showCustomToast(receivedMessage.username, receivedMessage.text, receivedMessage.createdAt);
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          } else {
            if (Notification.permission === 'granted') {
              navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(`Tin nhắn mới từ ${receivedMessage.username}`, {
                  body: receivedMessage.text,
                  icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png'
                });
              });
            }
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          }
        });
      }
    });

    client.activate();
    stompClient.current = client;

    MessageService.getMessagesByRoomId(roomId)
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error("Error fetching messages: ", error);
      });

    return () => {
      client.deactivate();
    };
  }, [roomId, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [open, messages]);

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
      inputRef.current?.focus();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Messages</DialogTitle>
      <DialogContent>
        <List className="custom-messages-list">
          {messages.map((msg, index) => (
            <ListItem key={index} className={`custom-message-item ${String(msg.userId) === userID ? 'custom-message-right' : 'custom-message-left'}`}>
              <ListItemAvatar style={{ padding: '10px' }}>
                <Avatar style={{ width: '60px', height: '60px', fontSize: '24px' }}>{msg.username?.charAt(0) || '?'}</Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <>
                    <Typography variant="subtitle1" className={`custom-message-username ${String(msg.userId) === userID ? 'custom-message-info-right' : ''}`} style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {msg.username || 'Unknown'}
                    </Typography>
                    <Typography component="span" variant="body2" className={`custom-message-text ${String(msg.userId) === userID ? 'custom-message-info-right' : ''}`} style={{ fontSize: '20px' }}>
                      {msg.text}
                    </Typography>
                    <Typography component="span" variant="caption" className={`custom-message-time ${String(msg.userId) === userID ? 'custom-message-time-right' : ''}`} style={{ fontSize: '15px' }}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : 'Invalid Date'}
                    </Typography>
                  </>
                }
                className="custom-message-text-container"
              />
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>

        <div className="custom-message-input-container">
          <TextField placeholder="Type a message" value={message} onChange={(e) => setMessage(e.target.value)} fullWidth inputRef={inputRef} className="custom-message-input" />
          <IconButton onClick={handleSendMessage} disabled={!message.trim()} className="custom-message-send-button">
            <SendIcon />
          </IconButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesComponent;
