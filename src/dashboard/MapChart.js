import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Tooltip from '@material-ui/core/Tooltip';

// Đường dẫn tới file GeoJSON chứa bản đồ Việt Nam
const geoUrl = "/vn.json";

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

  useEffect(() => {
    fetch(geoUrl)
      .then((response) => response.json())
      .then((data) => {
        setGeoData(data);
        console.log("GeoJSON data loaded:", data);
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  // Sắp xếp các thành phố theo số lượng đơn hàng giảm dần và lấy top 5
  const sortedCities = Object.entries(cityData)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5);

  // Tạo mảng màu từ đậm đến nhạt
  const colors = ["#B22222", "#CD5C5C", "#F08080", "#FA8072", "#FFDAB9"];

  // Tạo một đối tượng để ánh xạ màu sắc cho từng thành phố trong top 5
  const cityColors = sortedCities.reduce((acc, [city], index) => {
    acc[city] = colors[index];
    return acc;
  }, {});

  const checkProvinceMatch = (provinceName) => {
    const matchedProvince = Object.keys(cityData).find((city) => {
      return city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ===
             provinceName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    });
    return matchedProvince;
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Danh sách top 5 thành phố */}
      <div style={{ position: "absolute", top: "20px", left: "20px", backgroundColor: "white", padding: "10px", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", zIndex: 1 }}>
        <h3>Top 5 Thành Phố</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {sortedCities.map(([city, count], index) => (
            <li 
              key={city} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                marginBottom: "10px", 
                fontWeight: "bold", 
                position: "relative",
                paddingLeft: "50px" // Tăng khoảng cách để không đè chữ
              }}
            >
              {/* Đường thẳng ở bên trái tên */}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  width: "30px",   // Độ rộng của đường thẳng
                  height: "15px",  // Độ dài của đường thẳng
                  backgroundColor: cityColors[city], // Màu của đường thẳng
                }}
              />
              <span>
                {index + 1}. {city} - {count} đơn hàng
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ transform: "translateX(-20%)", width: "100%", height: "100%" }}>
        <ComposableMap
          projection="geoMercator"
          width={window.innerWidth * 1.2} 
          height={window.innerHeight}
          projectionConfig={{
            scale: 2000, 
            center: [107, 15]
          }}
          style={{ width: "100%", height: "100%" }}
        >
          {geoData && (
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const provinceName = geo.properties.name;
                  const matchedProvince = checkProvinceMatch(provinceName);

                  // Áp dụng màu sắc từ cityColors nếu thành phố thuộc top 5, nếu không sẽ là màu xám nhạt
                  const fillColor = matchedProvince ? cityColors[matchedProvince] || "#EAEAEC" : "#EAEAEC";

                  return (
                    <Tooltip
                      key={geo.rsmKey}
                      title={matchedProvince ? matchedProvince : provinceName}
                      arrow
                      placement="top"
                    >
                      <Geography
                        geography={geo}
                        fill={fillColor}
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
      </div>
    </div>
  );
};

export default MapChart;
