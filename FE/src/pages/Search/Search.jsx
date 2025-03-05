import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { axiosInstance } from "../../../Axios";
import CardSearch from "../../component/Search/CardSearch";

function Search() {
  const [search, setSearch] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const [tamgia, setTamgia] = useState("");
  const [songuoi, setSonguoi] = useState("");
  const [khuvuc, setKhuvuc] = useState("");

  // Fetch dữ liệu khi có thay đổi trong bộ lọc
  const fetchSearch = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/search?ten_phong_tro=${search}&dia_chi=${khuvuc}&so_luong_nguoi=${songuoi}&trang_thai=1&max_gia=${tamgia}`
      );
      const sortedResults = res.data.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setDataSearch(sortedResults);
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  // Gọi fetch API mỗi khi bộ lọc thay đổi
  useEffect(() => {
    fetchSearch();
  }, [search, tamgia, songuoi, khuvuc]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCheckboxChange = (value, setter) => {
    setter((prev) => (prev === value ? "" : value)); // Chọn lại sẽ bỏ chọn
  };

  return (
    <div className="w-full">
      <div className="max-w-[1920px] mx-auto px-[150px] mt-[78px] flex gap-[59px]">
        {/* Bộ lọc */}
        <div>
          <div className="bg-[#282C4E] py-[22px] px-[18px] rounded-lg">
            <p className="text-base text-white mb-[11px]">Tìm kiếm phòng trọ</p>
            <div className="relative flex max-w-[259px] h-11">
              <CiSearch className="absolute top-[30%] left-3 text-xl" />
              <input
                type="text"
                placeholder="Nhập tên phòng trọ"
                className="pl-[42px] rounded-lg"
                onChange={handleChange}
                value={search}
              />
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#23274A] my-8">Lọc kết quả</h3>

          <div className="space-y-10">
            {/* Tầm giá */}
            <div className="bg-[#282C4E] rounded-lg">
              <p className="text-base text-white py-[22px] px-[18px]">
                Tầm giá trở xuống
              </p>
              <div className="bg-white py-[22px] px-[18px] flex flex-col gap-[15px]">
                {["200000", "500000", "1000000", "2000000", "5000000"].map(
                  (priceRange, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="checkbox"
                        className="text-[#333333] w-5 h-5"
                        checked={tamgia === priceRange}
                        onChange={() => handleCheckboxChange(priceRange, setTamgia)}
                      />
                      <p className="text-[#333333]">{priceRange}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Khu vực */}
            <div className="bg-[#282C4E] rounded-lg">
              <p className="text-base text-white py-[22px] px-[18px]">Khu Vực</p>
              <div className="bg-white py-[22px] px-[18px] flex flex-col gap-[15px]">
                {["Đà Nẵng", "Hà Nội", "Hồ Chí Minh", "Huế"].map(
                  (location, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="checkbox"
                        className="text-[#333333] w-5 h-5"
                        checked={khuvuc === location}
                        onChange={() => handleCheckboxChange(location, setKhuvuc)}
                      />
                      <p className="text-[#333333]">{location}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Số lượng người */}
            <div className="bg-[#282C4E] rounded-lg">
              <p className="text-base text-white py-[22px] px-[18px]">
                Số lượng người
              </p>
              <div className="bg-white py-[22px] px-[18px] flex flex-col gap-[15px]">
                {["1", "2", "3", "4", "5"].map((number, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="checkbox"
                      className="text-[#333333] w-5 h-5"
                      checked={songuoi === number}
                      onChange={() => handleCheckboxChange(number, setSonguoi)}
                    />
                    <p className="text-[#333333]">{number}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Kết quả tìm kiếm */}
        <div>
          <p className="font-bold text-2xl">Kết quả tìm kiếm: {search}</p>
          <CardSearch data={dataSearch} />
        </div>
      </div>
    </div>
  );
}

export default Search;
