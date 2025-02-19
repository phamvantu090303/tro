import { useState, useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

function MapUpdater({ toado }) {
  const map = useMap();
  useEffect(() => {
    if (toado) {
      map.setView(toado, 16, { animate: true });
    }
  }, [toado]);
  return null;
}

function FullscreenMapFixer() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, []);
  return null;
}

function MapDetail({ toado }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [route, setRoute] = useState(null);
  const mapRef = useRef(null);
  const routingRef = useRef(null);

  if (!toado) {
    return <p style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>Không có dữ liệu vị trí</p>;
  }

  useEffect(() => {
    if (toado && mapRef.current) {
      mapRef.current.setView(toado, 16, { animate: true });
    }
  }, [toado]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const userCoords = [userLat, userLng];
          setUserLocation(userCoords);

          // Xóa tuyến đường cũ nếu có
          if (routingRef.current) {
            mapRef.current.removeControl(routingRef.current);
          }

          // Tính khoảng cách
          const R = 6371;
          const dLat = (toado[0] - userLat) * (Math.PI / 180);
          const dLon = (toado[1] - userLng) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(userLat * (Math.PI / 180)) * Math.cos(toado[0] * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          setDistance((R * c).toFixed(2));

          mapRef.current.flyTo(userCoords, 16, { animate: true });
        },
        (error) => {
          console.error("Lỗi lấy vị trí:", error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert("Trình duyệt không hỗ trợ định vị!");
    }
  };

  const showRoute = () => {
    if (!userLocation) {
      alert("Bạn cần lấy vị trí trước khi xem đường đi!");
      return;
    }

    if (routingRef.current) {
      mapRef.current.removeControl(routingRef.current);
    }

    routingRef.current = L.Routing.control({
      waypoints: [L.latLng(userLocation[0], userLocation[1]), L.latLng(toado[0], toado[1])],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }],
      },
      createMarker: () => null, // Ẩn marker mặc định của tuyến đường
    }).addTo(mapRef.current);

    setRoute(routingRef.current);
  };

  return (
    <div style={{
      position: isFullScreen ? "fixed" : "relative",
      top: 0, left: 0,
      width: isFullScreen ? "100vw" : "60%",
      height: isFullScreen ? "100vh" : "auto",
      background: "#f8f9fa",
      padding: "15px",
      borderRadius: "12px",
      boxShadow: isFullScreen ? "none" : "0px 4px 10px rgba(0, 0, 0, 0.2)",
      border: isFullScreen ? "none" : "2px solid #ddd",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: "auto",
      zIndex: isFullScreen ? 9999 : "auto",
    }}>
      <button
        onClick={() => setIsFullScreen(!isFullScreen)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: isFullScreen ? "red" : "#007bff",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "14px",
          zIndex: 1000,
        }}
      >
        {isFullScreen ? "Thu nhỏ" : "Phóng to"}
      </button>

      <div style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        padding: isFullScreen ? "0" : "10px",
        borderRadius: isFullScreen ? "0px" : "10px",
        boxShadow: isFullScreen ? "none" : "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}>
        <MapContainer
          center={toado}
          zoom={16}
          whenCreated={(map) => (mapRef.current = map)}
          style={{
            height: isFullScreen ? "95vh" : "450px",
            width: "100%",
            borderRadius: "10px",
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" />
          <Marker position={toado}>
            <Popup><strong>Vị trí trọ:</strong> {toado[0]}, {toado[1]}</Popup>
          </Marker>
          <Circle center={toado} radius={100} pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.3 }} />
          <MapUpdater toado={toado} />
          <FullscreenMapFixer />
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>Bạn đang ở đây!</Popup>
            </Marker>
          )}
        </MapContainer>

        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <button onClick={getUserLocation} style={{ marginRight: "10px", padding: "10px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            📍 Lấy Vị Trí Của Tôi
          </button>
          <button onClick={showRoute} style={{ padding: "10px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            🚗 Chỉ Đường
          </button>
        </div>

        {distance !== null && <p style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold", marginTop: "10px" }}>📍 Khoảng cách: {distance} km</p>}
      </div>
    </div>
  );
}

export default MapDetail;
