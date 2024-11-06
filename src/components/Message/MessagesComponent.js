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
  DialogTitle,
  CircularProgress
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import StopIcon from '@material-ui/icons/Stop';
import CloseIcon from '@material-ui/icons/Close';
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
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [openRecordingModal, setOpenRecordingModal] = useState(false);

  const stompClient = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null); // New ref for clearing file input
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const username = useSelector((state) => state.auth.username) || 'Unknown';

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleStartRecording = async () => {
    setOpenRecordingModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();

      mediaRecorderRef.current.ondataavailable = (e) => {
        setRecordingBlob(e.data);
      };

      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleSend = async () => {
    if (isSending) return;

    setIsSending(true);

    if (recordingBlob) {
      const formData = new FormData();
      formData.append('file', recordingBlob, 'recording.mp3');
      formData.append('type', 'auto');
      formData.append('roomId', roomId);
      formData.append('senderId', userID);
      formData.append('username', username);
      formData.append('role', 'USER');

      try {
        const response = await MessageService.sendMedia(formData);
        setMessages((prevMessages) => [...prevMessages, response.data]);
      } catch (error) {
        console.error('Error sending recorded audio:', error);
      } finally {
        setRecordingBlob(null);
        setOpenRecordingModal(false);
        setIsSending(false);
      }
    } else if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'auto');
      formData.append('roomId', roomId);
      formData.append('senderId', userID);
      formData.append('username', username);
      formData.append('role', 'USER');

      try {
        const response = await MessageService.sendMedia(formData);
        setMessages((prevMessages) => [...prevMessages, response.data]);
        console.log("response message:", response);
      } catch (error) {
        console.error('Error sending media:', error);
      } finally {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = ''; // Clear the file input
        setIsSending(false);
      }
    } else if (message.trim()) {
      const chatMessage = {
        text: message,
        username: username,
        role: 'USER',
        userId: userID,
        roomId: roomId,
        unRead: true,
      };
      console.log("send message:", chatMessage);

      stompClient.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage)
      });

      setMessage('');
      setIsSending(false);
    }
  };

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
          const isDuplicate = messages.some((msg) => msg.id === receivedMessage.id);

          if (!isDuplicate) {
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Messages</DialogTitle>
      <DialogContent>
        <List className="custom-messages-list">
          {messages.map((msg, index) => (
            <ListItem key={index} className={`custom-message-item ${String(msg.userId) === String(userID) ? 'custom-message-right' : 'custom-message-left'}`}>
              <ListItemAvatar style={{ padding: '10px' }}>
                <Avatar style={{ width: '60px', height: '60px', fontSize: '24px' }}>{msg.username?.charAt(0) || '?'}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <Typography variant="subtitle1" className={`custom-message-username ${String(msg.userId) === String(userID) ? 'custom-message-info-right' : ''}`} style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {msg.username || 'Unknown'}
                    </Typography>
                    {msg.mediaUrl ? (
                      msg.mediaType === 'image' ? (
                        <img src={msg.mediaUrl} alt="Sent media" style={{ maxWidth: '100%' }} />
                      ) : msg.mediaType === 'video' ? (
                        <video src={msg.mediaUrl} controls style={{ maxWidth: '100%' }} />
                      ) : (
                        <audio src={msg.mediaUrl} controls />
                      )
                    ) : (
                      <Typography component="span" variant="body2" className={`custom-message-text ${String(msg.userId) === String(userID) ? 'custom-message-info-right' : ''}`} style={{ fontSize: '20px' }}>
                        {msg.text}
                      </Typography>
                    )}
                    <Typography component="span" variant="caption" className={`custom-message-time ${String(msg.userId) === String(userID) ? 'custom-message-time-right' : ''}`} style={{ fontSize: '15px' }}>
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
          <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ marginBottom: '10px' }} />
          <TextField placeholder="Type a message" value={message} onChange={(e) => setMessage(e.target.value)} fullWidth inputRef={inputRef} className="custom-message-input" />
          <IconButton onClick={() => setOpenRecordingModal(true)}>
            <MicIcon />
          </IconButton>
          <IconButton onClick={handleSend} disabled={isSending || (!message.trim() && !file && !recordingBlob)} className="custom-message-send-button">
            {isSending ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </div>
      </DialogContent>

      <Dialog open={openRecordingModal} onClose={() => setOpenRecordingModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <IconButton onClick={() => setOpenRecordingModal(false)} style={{ position: 'absolute', right: '8px', top: '8px' }}>
            <CloseIcon />
          </IconButton>
          Record Audio
        </DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!isRecording ? (
              <IconButton onClick={handleStartRecording}>
                <MicIcon fontSize="large" />
              </IconButton>
            ) : (
              <IconButton onClick={handleStopRecording}>
                <StopIcon fontSize="large" />
              </IconButton>
            )}
          </div>
          {recordingBlob && (
            <>
              <audio controls src={URL.createObjectURL(recordingBlob)} style={{ marginTop: '10px', width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <IconButton onClick={handleSend} color="primary">
                  <SendIcon fontSize="large" /> Send
                </IconButton>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default MessagesComponent;
