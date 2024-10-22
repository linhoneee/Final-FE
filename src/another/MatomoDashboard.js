// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const MatomoDashboard = () => {
//   const [visitData, setVisitData] = useState(null);
//   const [trafficSource, setTrafficSource] = useState(null);
//   const [bounceRate, setBounceRate] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = 'd68d106b780d6e40e43423207f222699'; // Đảm bảo token API đúng
//     const baseUrl = 'https://79fb1172120135ngrokfreeapp.matomo.cloud/?module=API';

//     // POST request để lấy dữ liệu về số lượt truy cập
//     axios.post(baseUrl, {
//       method: 'VisitsSummary.get',
//       idSite: 1,
//       period: 'day',
//       date: 'today',
//       format: 'JSON',
//       token_auth: token
//     })
//     .then(response => {
//       setVisitData(response.data);
//     })
//     .catch(error => {
//       setError('Error fetching visit data: ' + error.message);
//     });

//     // POST request để lấy nguồn truy cập
//     axios.post(baseUrl, {
//       method: 'Referrers.getAll',
//       idSite: 1,
//       period: 'day',
//       date: 'today',
//       format: 'JSON',
//       token_auth: token
//     })
//     .then(response => {
//       setTrafficSource(response.data);
//     })
//     .catch(error => {
//       setError('Error fetching traffic source: ' + error.message);
//     });

//     // POST request để lấy tỷ lệ thoát
//     axios.post(baseUrl, {
//       method: 'VisitsSummary.getBounceRate',
//       idSite: 1,
//       period: 'day',
//       date: 'today',
//       format: 'JSON',
//       token_auth: token
//     })
//     .then(response => {
//       setBounceRate(response.data);
//     })
//     .catch(error => {
//       setError('Error fetching bounce rate: ' + error.message);
//     });

//   }, []);

//   return (
//     <div>
//       <h2>Matomo Dashboard</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {visitData && <p>Total Visits: {visitData.nb_visits}</p>}
//       {trafficSource && <p>Traffic Source: {trafficSource.nb_visits}</p>}
//       {bounceRate && <p>Bounce Rate: {bounceRate}%</p>}
//     </div>
//   );
// };

// export default MatomoDashboard;
