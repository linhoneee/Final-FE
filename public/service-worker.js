self.addEventListener('push', (event) => {
    const data = event.data.json();
    const title = `Tin nhắn mới từ ${data.username}`;
    const options = {
      body: data.text,
      icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png', // Icon trực tuyến cho thông báo
      badge: 'https://cdn-icons-png.flaticon.com/512/263/263115.png', // Badge trực tuyến cho thông báo
    };
  
    // Tạo một thông báo và phát âm thanh đi kèm
    event.waitUntil(
      (async () => {
        await self.registration.showNotification(title, options);
  
        // Phát âm thanh
        const soundUrl = '/path/to/notification-sound.mp3'; // Thay thế bằng đường dẫn tới file âm thanh của bạn
        const audio = new Audio(soundUrl);
        audio.play();
      })()
    );
  });
  