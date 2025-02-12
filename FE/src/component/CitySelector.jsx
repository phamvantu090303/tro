import { useState, useEffect } from "react";
import { axiosInstance } from "../../Axios";

function CitySelector() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axiosInstance.get("/danh-muc/");
        setCities(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thành phố:", error);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div>
      <select
        className="px-5 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none bg-white"
        value={selectedCity}
        onChange={handleChange}
      >
        <option value="" disabled>
          Chọn thành phố
        </option>
        {cities.map((city) => (
          <option key={city.id} value={city.ten_danh_muc}>
            {city.ten_danh_muc}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CitySelector;
