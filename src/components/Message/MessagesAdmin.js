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
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MicIcon from '@material-ui/icons/Mic';
import StopIcon from '@material-ui/icons/Stop';
import CloseIcon from '@material-ui/icons/Close';
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
  const [file, setFile] = useState(null); 
  const [recordingBlob, setRecordingBlob] = useState(null); 
  const [isRecording, setIsRecording] = useState(false); 
  const [openRecordingModal, setOpenRecordingModal] = useState(false);
  const [isSending, setIsSending] = useState(false); // Trạng thái đang gửi

  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const username = useSelector((state) => state.auth.username) || 'Unknown';
  const userID = String(useSelector((state) => state.auth.userID));
  const [recordingTime, setRecordingTime] = useState(0); 
  const [finalRecordingTime, setFinalRecordingTime] = useState(null);

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
          setMessages((prevMessages) => {
            const messageExists = prevMessages.some(
              (msg) => msg.id === receivedMessage.id
            );
            return messageExists ? prevMessages : [...prevMessages, receivedMessage];
          });
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
      if (!avatars[msg.userId]) {
        try {
          const userResponse = await UserService.getUserById(msg.userId);
          avatars[msg.userId] = userResponse.data.picture
            ? `http://localhost:8080${userResponse.data.picture}`
            : null;
        } catch (error) {
          console.error(`Failed to fetch avatar for user ${msg.userId}:`, error);
        }
      }
    }
    return avatars;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleClearMedia = () => {
    setFile(null);
    setRecordingBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartRecording = async () => {
    setOpenRecordingModal(true);
    setRecordingTime(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      mediaRecorderRef.current.ondataavailable = (e) => setRecordingBlob(e.data);
      setIsRecording(true);
  
      const timer = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
      mediaRecorderRef.current.onstop = () => clearInterval(timer);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setFinalRecordingTime(recordingTime);
    }
  };
  const handleCloseRecordingModal = () => {
    setOpenRecordingModal(false);
    setRecordingBlob(null);
    setRecordingTime(0);
    setFinalRecordingTime(null);
    setIsRecording(false);
  };
    

  const handleSendMessage = async () => {
    if (isSending) return;
    setIsSending(true);

    if (recordingBlob || file) {
      const formData = new FormData();
      formData.append('file', recordingBlob || file, recordingBlob ? 'recording.mp3' : file.name);
      formData.append('type', recordingBlob ? 'audio' : file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'auto');
      formData.append('roomId', roomId);
      formData.append('senderId', userID);
      formData.append('username', username);
      formData.append('role', 'ADMIN');

      try {
        const response = await MessageService.sendMedia(formData);
        setMessages((prevMessages) => [...prevMessages, response.data]);
      } catch (error) {
        console.error('Error sending media:', error);
      } finally {
        handleClearMedia();
        setOpenRecordingModal(false);
        setIsSending(false);
      }
    } else if (message.trim()) {
      const chatMessage = {
        text: message,
        username: username,
        role: 'ADMIN',
        userId: userID,
        roomId: roomId,
        unRead: true,
      };

      stompClient.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage),
      });

      setMessage('');
      setIsSending(false);
    }
  };


  useEffect(() => {
    fetchRoomUser();
    initializeWebSocketAndMessages();
    scrollToBottom();
  }, [fetchRoomUser, initializeWebSocketAndMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderRoomUserInfo = useMemo(
    () =>
      roomUser && (
        <div className="message-admin-room-user-info">
          <Avatar
            className="message-admin-room-user-avatar"
            src={roomUser.picture ? `http://localhost:8080${roomUser.picture}` : null}
          >
            {roomUser.username?.charAt(0) || '?'}
          </Avatar>
          <Typography variant="h6" className="message-admin-room-user-name">
            {roomUser.username || 'Unknown User'}
          </Typography>
        </div>
      ),
    [roomUser]
  );

  const renderMessages = useMemo(
    () => (
      <List className="message-admin-custom-messages-list">
        {messages.map((msg, index) => (
          <ListItem
          key={`${msg.id}-${index}`} // Đảm bảo mỗi phần tử có key duy nhất
            className={`message-admin-custom-message-item ${
              String(msg.userId) === userID
                ? 'message-admin-custom-message-right'
                : 'message-admin-custom-message-left'
            }`}
          >
            <ListItemAvatar className="message-admin-custom-avatar">
              <Avatar
                className="message-admin-custom-message-avatar"
                src={userAvatars[msg.userId] || null}
              >
                {userAvatars[msg.userId] ? null : msg.username?.charAt(0) || '?'}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <>
                  <Typography
                    variant="subtitle1"
                    className={`message-admin-custom-message-username ${
                      String(msg.userId) === userID ? 'message-admin-custom-message-info-right' : ''
                    }`}
                  >
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
                    <Typography
                      component="span"
                      variant="body2"
                      className={`message-admin-custom-message-text ${
                        String(msg.userId) === userID ? 'message-admin-custom-message-info-right' : ''
                      }`}
                    >
                      {msg.text}
                    </Typography>
                  )}
                  <Typography
                    component="span"
                    variant="caption"
                    className={`message-admin-custom-message-time ${
                      String(msg.userId) === userID ? 'message-admin-custom-message-time-right' : ''
                    }`}
                  >
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
    ),
    [messages, userAvatars, userID]
  );

  return (
    <div className="message-admin-container">
      {renderRoomUserInfo}
      {renderMessages}
      <div className="message-admin-custom-message-input-container">
        {!file && !recordingBlob && (
          <>
            <IconButton onClick={() => fileInputRef.current.click()} className="message-admin-custom-media-button">
              <AttachFileIcon fontSize="large" />
            </IconButton>
            <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
            <IconButton onClick={() => setOpenRecordingModal(true)} className="message-admin-custom-record-button">
              <MicIcon />
            </IconButton>
          </>
        )}
        {(file || recordingBlob) && (
          <div className="selected-media-info">
            <Typography variant="body2">
              {file ? `${file.name} (${(file.size / 1024).toFixed(2)} KB)` : 'Recording...'}
            </Typography>
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
          className="message-admin-custom-message-input"
          disabled={!!file || !!recordingBlob}
        />
        <IconButton onClick={handleSendMessage} disabled={isSending || (!message.trim() && !file && !recordingBlob)} className="message-admin-custom-message-send-button">
          {isSending ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </div>

      <Dialog open={openRecordingModal} onClose={handleCloseRecordingModal} maxWidth="sm" fullWidth className="message-admin-recording-dialog">
        <DialogTitle className="message-admin-recording-header">
          <IconButton onClick={() => setOpenRecordingModal(false)} style={{ position: 'absolute', right: '8px', top: '8px' }}>
            <CloseIcon />
          </IconButton>
          Ghi âm tin nhắn
        </DialogTitle>
        <DialogContent>
          <div className="recording-controls">
            <Typography variant="body2" className="recording-time">
              Thời gian ghi: {recordingBlob ? `${Math.floor(finalRecordingTime / 60)}:${finalRecordingTime % 60 < 10 ? `0${finalRecordingTime % 60}` : finalRecordingTime % 60}` : `${Math.floor(recordingTime / 60)}:${recordingTime % 60 < 10 ? `0${recordingTime % 60}` : recordingTime % 60}`}
            </Typography>

            {!recordingBlob ? (
              <IconButton onClick={!isRecording ? handleStartRecording : handleStopRecording} className="recording-button">
                {isRecording ? <StopIcon fontSize="large" /> : <MicIcon fontSize="large" />}
              </IconButton>
            ) : (
              <>
                <audio controls src={URL.createObjectURL(recordingBlob)} style={{ marginTop: '10px', width: '100%' }} />
                <div className="send-audio-container">
                  <IconButton onClick={handleSendMessage} color="primary" className="send-audio-button">
                    {isSending ? <CircularProgress size={24} /> : <SendIcon fontSize="large" />} Gửi
                  </IconButton>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageAdmin;
