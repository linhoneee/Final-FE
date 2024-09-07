import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import RoomList from './RoomList'; // Component hiển thị danh sách các phòng
import MessageAdmin from './MessagesAdmin'; // Component hiển thị tin nhắn
import './ChatPage.css';

const ChatPage = () => {
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId); // Cập nhật roomId được chọn khi người dùng click vào room
  };

  return (
    <Grid container className="chat-page-container">
      <Grid item xs={4} className="room-list-container">
        <RoomList onRoomSelect={handleRoomSelect} />
      </Grid>
      <Grid item xs={8} className="message-container">
        {selectedRoomId ? (
          <MessageAdmin roomId={selectedRoomId} />
        ) : (
          <div className="empty-message-container">
            <Typography variant="h6" color="textSecondary">
              Chọn một phòng để bắt đầu trò chuyện
            </Typography>
          </div>
        )}
      </Grid>
    </Grid>
  );
};

export default ChatPage;
