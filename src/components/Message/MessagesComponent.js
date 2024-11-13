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
import AttachFileIcon from '@material-ui/icons/AttachFile';

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
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Lưu trữ thông tin media đã chọn
    }
  };
  
  const handleClearMedia = () => {
    setFile(null); // Xóa media đã chọn
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input file
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

  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording]);
  const [finalRecordingTime, setFinalRecordingTime] = useState(null);

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setFinalRecordingTime(recordingTime); // Lưu thời gian ghi âm cuối cùng
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
  
    let heartbeatInterval; // Khai báo biến heartbeatInterval
  
    const socket = new SockJS('http://localhost:6010/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: console.log,
      onConnect: () => {
        // Gửi heartbeat ngay lập tức khi kết nối thành công
        client.publish({
          destination: '/app/chat.heartbeat',
          body: JSON.stringify(userID), // Gửi ID người dùng làm heartbeat
        });
        console.log('Initial heartbeat sent for user:', userID); // Log xác nhận gửi heartbeat đầu tiên
  
        // Thiết lập gửi heartbeat mỗi 30 giây sau đó
        heartbeatInterval = setInterval(() => {
          client.publish({
            destination: '/app/chat.heartbeat',
            body: JSON.stringify(userID),
          });
          console.log('Heartbeat sent for user:', userID); // Log xác nhận gửi heartbeat tiếp theo
        }, 30000);
  
        // Đăng ký để nhận tin nhắn mới trong phòng chat
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
                    icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
                  });
                });
              }
              setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            }
          }
        });
      },
    });
  
    client.activate();
    stompClient.current = client;
  
    // Fetch tin nhắn từ room ngay khi component mở
    MessageService.getMessagesByRoomId(roomId)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching messages: ', error);
      });
  
    return () => {
      // Cleanup: Ngừng gửi heartbeat và ngắt kết nối WebSocket khi component bị huỷ
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval); // Dọn dẹp heartbeatInterval
      }
      client.deactivate(); // Dọn dẹp kết nối WebSocket
    };
  }, [roomId, open, userID]);
  

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [open, messages]);

  const handleCloseRecordingModal = () => {
    setOpenRecordingModal(false);
    setRecordingBlob(null);
    setRecordingTime(0);
    setFinalRecordingTime(null);
  };
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
  <DialogTitle className="custom-chat-header">
    <div className="admin-info-container">
      <img src="/admin_logo.png" alt="Admin Logo" className="admin-logo" />
      <div>
        <Typography variant="h6" className="admin-name">Hỗ trợ khách hàng - Admin</Typography>
        <Typography variant="body2" className="admin-status">Trực tuyến • Sẵn sàng hỗ trợ bạn</Typography>
      </div>
    </div>
  </DialogTitle>      <DialogContent>
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
  {!file && (
    <>
      <IconButton onClick={() => fileInputRef.current.click()} className="custom-message-media-button">
        <AttachFileIcon fontSize="large" />
      </IconButton>
      <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
      <IconButton onClick={() => setOpenRecordingModal(true)} className="custom-message-record-button">
        <MicIcon />
      </IconButton>
    </>
  )}
  {file && (
    <div className="selected-media-info">
      <Typography variant="body2">{file.name} ({(file.size / 1024).toFixed(2)} KB)</Typography>
      <IconButton onClick={handleClearMedia} className="clear-media-button">
        <CloseIcon />
      </IconButton>
    </div>
  )}
  <TextField
    placeholder="Type a message"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    fullWidth
    inputRef={inputRef}
    className="custom-message-input"
    disabled={!!file} // Disable input when media is selected
  />
  <IconButton
    onClick={handleSend}
    disabled={isSending || (!message.trim() && !file && !recordingBlob)}
    className="custom-message-send-button"
  >
    {isSending ? <CircularProgress size={24} /> : <SendIcon />}
  </IconButton>
</div>


                         
      </DialogContent>

      <Dialog open={openRecordingModal} onClose={handleCloseRecordingModal} maxWidth="sm" fullWidth className="recording-modal">
      <DialogTitle>
          <IconButton onClick={handleCloseRecordingModal} style={{ position: 'absolute', right: '8px', top: '8px' }}>
            <CloseIcon />
          </IconButton>
          Record Audio
        </DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            {/* Hiển thị thời gian ghi âm */}
            <Typography variant="body2" className="recording-time">
              Thời gian ghi: {recordingBlob ? `${Math.floor(finalRecordingTime / 60)}:${finalRecordingTime % 60 < 10 ? `0${finalRecordingTime % 60}` : finalRecordingTime % 60}` : `${Math.floor(recordingTime / 60)}:${recordingTime % 60 < 10 ? `0${recordingTime % 60}` : recordingTime % 60}`}
            </Typography>

            {/* Hiển thị nút bắt đầu/dừng ghi âm */}
            {!recordingBlob && (
              <IconButton onClick={!isRecording ? handleStartRecording : handleStopRecording} className="recording-button">
                {isRecording ? <StopIcon fontSize="large" /> : <MicIcon fontSize="large" />}
              </IconButton>
            )}
          </div>

          {/* Hiển thị bản ghi âm sau khi dừng */}
          {recordingBlob && (
            <>
              <audio controls src={URL.createObjectURL(recordingBlob)} style={{ marginTop: '10px', width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <IconButton onClick={handleSend} color="primary" className="send-audio-button">
                  <SendIcon fontSize="large" /> Gửi
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
