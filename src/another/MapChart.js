import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Tooltip from '@material-ui/core/Tooltip'; // Import thêm Tooltip để hiển thị tên

// Đường dẫn tới file GeoJSON chứa bản đồ Việt Nam
const geoUrl = "/vn.json"; // Đảm bảo rằng vn.json nằm trong thư mục public

// Dữ liệu cứng cho các thành phố và số lượng đơn hàng
const cityData = {
  "Kiên Giang": 21,
  "Đà Nẵng": 20,
  "Hà Nội": 10,
  "Gia lai": 10,
  "Quảng Trị": 5
};

const MapChart = () => {
  const [geoData, setGeoData] = useState(null);

  // Lấy dữ liệu GeoJSON từ file
  useEffect(() => {
    fetch(geoUrl)
      .then((response) => response.json())
      .then((data) => {
        setGeoData(data);
        console.log("GeoJSON data loaded:", data);
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  // Hàm kiểm tra và log các tên tỉnh/thành phố không khớp
  const checkProvinceMatch = (provinceName) => {
    const matchedProvince = Object.keys(cityData).find((city) => {
      // So sánh chuỗi sau khi loại bỏ khoảng trắng và ký tự đặc biệt
      return city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ===
             provinceName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    });
    return matchedProvince;
  };

  return (
    <div style={{ margin: "50px", textAlign: "center" }}>
      <h2>Bản đồ các tỉnh/thành phố Việt Nam</h2>
      <ComposableMap
        projection="geoMercator"
        width={800}
        height={600}
        projectionConfig={{
          scale: 2000, // Điều chỉnh tỷ lệ hiển thị bản đồ
          center: [107, 16] // Điều chỉnh tọa độ trung tâm bản đồ
        }}
      >
        {geoData && (
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Lấy tên của tỉnh/thành phố từ GeoJSON
                const provinceName = geo.properties.name;

                // Kiểm tra và log tên không khớp
                const matchedProvince = checkProvinceMatch(provinceName);

                if (matchedProvince) {
                  console.log(`Province matched: ${provinceName} -> ${matchedProvince}`);
                } else {
                  console.warn(`No match for: ${provinceName}`);
                }

                return (
                  <Tooltip
                    title={matchedProvince ? matchedProvince : provinceName}
                    arrow
                    placement="top"
                  >
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={matchedProvince ? "#FF0000" : "#EAEAEC"} // Nếu có trong dữ liệu, tô màu đỏ
                      stroke="#D6D6DA"
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#F53", outline: "none" },
                        pressed: { outline: "none" }
                      }}
                    />
                  </Tooltip>
                );
              })
            }
          </Geographies>
        )}
      </ComposableMap>

      <h3>Dữ liệu thành phố</h3>
      <table style={{ margin: "20px auto", borderCollapse: "collapse", width: "50%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "10px" }}>Thành phố</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(cityData).map(([city, count]) => (
            <tr key={city}>
              <td style={{ border: "1px solid black", padding: "10px" }}>{city}</td>
              <td style={{ border: "1px solid black", padding: "10px" }}>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MapChart;
