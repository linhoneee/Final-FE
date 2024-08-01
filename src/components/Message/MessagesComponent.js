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
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useSelector } from 'react-redux';
import MessageService from '../../services/MessageService'; // Import đúng cách đối tượng mặc định
import { useParams } from 'react-router-dom';

const MessagesComponent = ({ initialMessages }) => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState(initialMessages || []);
  const [message, setMessage] = useState('');
  const stompClient = useRef(null);
  const inputRef = useRef(null);

  const username = useSelector((state) => state.auth.username) || 'Unknown';
  const userID = useSelector((state) => state.auth.userID);

  useEffect(() => {
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
      .then(response => setMessages(response.data))
      .catch(console.error);

    return () => {
      client.deactivate();
    };
  }, [roomId]);

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
      
      setMessage(''); // Xóa tin nhắn sau khi gửi
      inputRef.current?.focus();
    }
  };

  return (
    <div>
      <List>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar>{msg.username?.charAt(0) || '?'}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="subtitle1">{msg.username || 'Unknown'}</Typography>}
              secondary={msg.text}
            />
          </ListItem>
        ))}
      </List>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          inputRef={inputRef}
        />
        <IconButton onClick={handleSendMessage} disabled={!message.trim()}>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default MessagesComponent;
