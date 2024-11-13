import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Tooltip from '@material-ui/core/Tooltip';

const geoUrl = "/vn.json";

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

  const sortedCities = Object.entries(cityData)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5);

  const colors = ["#B22222", "#CD5C5C", "#F08080", "#FA8072", "#FFDAB9"];

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
    <div>
            {/* <h2>top 5 thành phố</h2> */}

 
    <div style={{ 
      position: "relative", 
      width: "100%", 
      maxWidth: "885px", // Giới hạn chiều rộng của container
      maxHeight: "590px", // Giới hạn chiều cao của container
      overflow: "hidden", 
      padding: 0, 
      margin: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
      borderRadius: "8px",
      backgroundColor: "white"
    }}>
      {/* Danh sách top 5 thành phố */}
      <div style={{ 
        position: "absolute", 
        top: "20px", 
        left: "20px", 
        backgroundColor: "white", 
        padding: "5px", 
        borderRadius: "4px", 
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", 
        zIndex: 1,
        maxWidth: "100vh",
        transform: "translate(175px, 90px)" // Di chuyển bảng top 5
      }}>
        <h3 style={{ margin: 0, fontSize: "16px" }}>Top 5 Thành Phố mua hàng nhiều nhất</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
          {sortedCities.map(([city, count], index) => (
            <li 
              key={city} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                fontWeight: "bold", 
                fontSize: "14px",
                position: "relative",
                paddingLeft: "40px" 
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  width: "20px",
                  height: "10px",
                  backgroundColor: cityColors[city],
                }}
              />
              <span>
                {index + 1}. {city} - {count} đơn hàng
              </span>
            </li>
          ))}
        </ul>
      </div>
    
      <div style={{ width: "100%", height: "600%", transform: "translate(-66px, -44px)" }}>
        <ComposableMap
          projection="geoMercator"
          width={500} 
          height={900} 
          projectionConfig={{
            scale: 1740,
            center: [107, 16] 
          }}
          style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}
        >
          {geoData && (
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const provinceName = geo.properties.name;
                  const matchedProvince = checkProvinceMatch(provinceName);
    
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
    </div>
  );
};

export default MapChart;
