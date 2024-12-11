// // public/service-worker.js

// self.addEventListener('push', (event) => {
//   console.log('Received push event:', event);

//   if (!event.data) {
//     console.error('No push data received.');
//   } else {
//     const data = event.data.json();
//     console.log('Received data:', data);

//     const title = `Tin nhắn mới từ ${data.username}`;
//     const options = {
//       body: data.text,
//       icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
//       badge: 'https://cdn-icons-png.flaticon.com/512/263/263115.png',
//     };

//     event.waitUntil(
//       self.registration.showNotification(title, options)
//     );
//   }
// });
