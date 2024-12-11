import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Tooltip from '@material-ui/core/Tooltip';
import OrderService from '../services/OrderService';

const geoUrl = "/vn.json";



const MapChart = () => {
  const [geoData, setGeoData] = useState(null);
  const [cityData, setCityData] = useState(null);
  
  
  useEffect(() => {
    // Fetch city data from API
    OrderService.getTopProvince().then(response => {
      setCityData(response.data);
      console.log("City data loaded:", response.data);
    }).catch(error => console.error("Error loading city data:", error));

    // Fetch geo data
    fetch(geoUrl)
      .then((response) => response.json())
      .then((data) => {
        setGeoData(data);
        console.log("GeoJSON data loaded:", data);
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  const sortedCities = cityData ? Object.entries(cityData)
  .sort(([, countA], [, countB]) => countB - countA)
  .slice(0, 5) : [];


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

  if (!cityData || !geoData) {
    return <div>Loading...</div>;  // Show loading state until both data are fetched
  }

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
      borderRadius: "8px",
      backgroundColor: "white"
    }}>
      {/* Danh sách top 5 thành phố */}
      <div style={{ 
        position: "absolute", 
        top: "20px", 
        left: "20px", 
        backgroundColor: "white", 
    
        zIndex: 1,
        maxWidth: "100vh",
        transform: "translate(177px, 90px)" // Di chuyển bảng top 5
      }}>
                  <h3 style={{ 
            margin: 0, 
            fontSize: "15px", 
            fontWeight: "700", 
            color: "#3a7765", // Màu chữ cho tiêu đề
            fontFamily: "'Roboto', sans-serif" 
          }}>
          Top 5 Thành Phố mua hàng nhiều nhất
          </h3>
          <ul style={{ 
            listStyle: "none", 
            padding: 0, 
            margin: "5px 0 0 0", 
            fontFamily: "'Roboto', sans-serif" 
          }}>
          {sortedCities.map(([city, count], index) => (
            <li 
              key={city} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
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
    
      <div style={{ width: "100%", height: "600%", transform: "translate(-60px, -44px)" }}>
        <ComposableMap
          projection="geoMercator"
          width={477} 
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
