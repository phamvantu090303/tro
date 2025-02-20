import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Select from "react-select";

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ma_map: "",
    address: "",
    district: "",
    latitude: "",
    longitude: "",
    province: "",
    ward: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/map/AllMap");
        setLocations(response.data.data);
        setFilteredLocations(response.data.data);
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const map = L.map("map").setView([16.0471, 108.2062], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const bounds = [];

    filteredLocations.forEach((location) => {
      if (location.latitude && location.longitude) {
        const marker = L.marker([location.latitude, location.longitude], {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
            iconSize: [30, 30],
          }),
        }).addTo(map).bindPopup(`
            <b>${location.address}</b><br/>
            Phường: ${location.ward}<br/>
            Quận: ${location.district}<br/>
            Tỉnh: ${location.province}
          `);

        bounds.push([location.latitude, location.longitude]);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    map.on("click", async (e) => {
      if (e.latlng) {
        const { lat, lng } = e.latlng;

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
              params: {
                lat,
                lon: lng,
                format: "json",
              },
            }
          );

          const data = res.data.address;

          setFormData((prev) => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
            address: data.road || "",
            district: data.suburb || data.city_district || "",
            province: data.state || "",
            ward: data.village || data.town || data.city || "",
          }));
          setShowModal(true);
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      }
    });

    return () => map.remove();
  }, [filteredLocations]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddLocation = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/map/creatMap",
        formData
      );
      setLocations((prev) => [...prev, response.data.data]);
      setFilteredLocations((prev) => [...prev, response.data.data]);
      setFormData({
        ma_map: "",
        address: "",
        district: "",
        latitude: "",
        longitude: "",
        province: "",
        ward: "",
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const handleUpdateLocation = async () => {
    try {
      console.log("Updating location:", editingId, formData); // Debug dữ liệu trước khi gửi request
      const response = await axios.put(`http://localhost:5000/map/updateMap/${editingId}`, formData);
  
      console.log("Update response:", response.data); // Debug phản hồi từ server
  
      setLocations((prev) =>
        prev.map((location) => (location._id === editingId ? response.data.data : location))
      );
      setFilteredLocations((prev) =>
        prev.map((location) => (location._id === editingId ? response.data.data : location))
      );
      setFormData({ ma_map: "", address: "", district: "", latitude: "", longitude: "", province: "", ward: "" });
      setShowModal(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating location:', error.response ? error.response.data : error);
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/map/deleteMap/${id}`);
      setLocations((prev) => prev.filter((location) => location._id !== id));
      setFilteredLocations((prev) => prev.filter((location) => location._id !== id));
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const handleEditLocation = (location) => {
    setFormData({
      ma_map: location.ma_map,
      address: location.address,
      district: location.district,
      latitude: location.latitude,
      longitude: location.longitude,
      province: location.province,
      ward: location.ward,
    });
    setIsEditing(true);
    setEditingId(location._id);
    setShowModal(true);
  };

  const handleSearchChange = (selectedOption) => {
    if (selectedOption) {
      setFilteredLocations(locations.filter(location => location._id === selectedOption.value));
    } else {
      setFilteredLocations(locations);
    }
  };

  const searchOptions = locations.map(location => ({
    value: location._id,
    label: `${location.address}, ${location.ward}, ${location.district}, ${location.province}`
  }));

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        id="map"
        style={{ flex: 1, height: "80vh", borderRight: "2px solid #ddd" }}
      ></div>

      <div
        style={{ width: "50%", padding: "20px", backgroundColor: "#f9f9f9" }}
      >
        <h3>Danh Sách Vị Trí Nhà Trọ</h3>
        <Select
          options={searchOptions}
          onChange={handleSearchChange}
          isClearable
          placeholder="Tìm kiếm vị trí..."
        />
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
              <th>Mã map</th>
              <th>Địa Chỉ</th>
              <th>Phường</th>
              <th>Quận</th>
              <th>Tỉnh</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredLocations.map((location, index) => (
              <tr key={index}>
                <td>{location.ma_map}</td>
                <td>{location.address}</td>
                <td>{location.ward}</td>
                <td>{location.district}</td>
                <td>{location.province}</td>
                <td>
                  <button onClick={() => handleEditLocation(location)} style={{ marginRight: '10px' }}>
                    Sửa
                  </button>
                  <button onClick={() => handleDeleteLocation(location._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            overflow: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              zIndex: 10000,
            }}
          >
            <h3>{isEditing ? 'Cập Nhật Vị Trí Nhà Trọ' : 'Thêm Vị Trí Nhà Trọ Mới'}</h3>
            {[
              "ma_map",
              "address",
              "district",
              "latitude",
              "longitude",
              "province",
              "ward",
            ].map((field) => (
              <div key={field} style={{ marginBottom: "10px" }}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input
                  type={
                    field === "latitude" || field === "longitude"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                  required
                />
              </div>
            ))}
            <button
              onClick={isEditing ? handleUpdateLocation : handleAddLocation}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                padding: "10px",
                width: "100%",
                border: "none",
                borderRadius: "5px",
              }}
            >
              {isEditing ? 'Cập Nhật Vị Trí' : 'Lưu Vị Trí'}
            </button>
            <button
              onClick={() => {
                setShowModal(false);
                setIsEditing(false);
                setEditingId(null);
                setFormData({ ma_map: "", address: "", district: "", latitude: "", longitude: "", province: "", ward: "" });
              }}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                padding: "10px",
                width: "100%",
                border: "none",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;