import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../Axios";
import RoomTable from "../../../component/Admin/RoomTable";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDanhMuc } from "../../../Context/DanhMucContext";
import { usePhongTro } from "../../../Context/PhongTroContext";

function PhongTroAdmin() {
  const [chucnang, setChucnang] = useState("Tất cả các phòng");
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const { phongTro } = usePhongTro();
  const [dataPhongtro, setDataPhongtro] = useState([]);
  const { danhMuc } = useDanhMuc();
  const [selectedDanhMuc, setSelectedDanhMuc] = useState("");
  const [maps, setMaps] = useState([]);
  const [selectMap, setSelectMap] = useState("");

  useEffect(() => {
    try {
      const fetchDataMapandDanhMuc = async () => {
        const resMap = await axiosInstance.get("/map/AllMap");
        setMaps(resMap.data.data);
      };
      fetchDataMapandDanhMuc();
      if (phongTro.length > 0) {
        const sortedBooks = [...phongTro].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDataPhongtro(sortedBooks);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleAddImage = (event) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prevImages) => [...prevImages, ...fileArray]);
    }
  };

  const filteredRooms = dataPhongtro.filter((room) => {
    if (chucnang === "Phòng đã được thuê") return room.trang_thai === 1;
    if (chucnang === "Phòng trống") return room.trang_thai === 0;
    return true;
  });

  return (
    <div className="flex h-screen gap-3">
      {page === 1 && (
        <div className="w-full bg-gray-100 p-6 rounded-lg shadow-lg text-black">
          <h2 className="text-2xl font-bold">Room</h2>
          <div className="flex justify-between">
            <div className="flex gap-3">
              <p
                className={`text-lg py-2 px-4  ${
                  chucnang === "Tất cả các phòng"
                    ? "font-medium border-b border-gray-500"
                    : ""
                }`}
                onClick={() => {
                  setChucnang("Tất cả các phòng");
                }}
              >
                Tất cả các phòng
              </p>
              <p
                className={`text-lg py-2 px-4  ${
                  chucnang === "Phòng trống"
                    ? "font-medium border-b border-gray-500"
                    : ""
                }`}
                onClick={() => {
                  setChucnang("Phòng trống");
                }}
              >
                Phòng trống
              </p>
              <p
                className={`text-lg py-2 px-4  ${
                  chucnang === "Phòng đã được thuê"
                    ? "font-medium border-b border-gray-500"
                    : ""
                }`}
                onClick={() => setChucnang("Phòng đã được thuê")}
              >
                Phòng đã được thuê
              </p>
            </div>
            <button
              className="text-base bg-red-500 text-white rounded-full py-2 px-3"
              onClick={() => setPage(2)}
            >
              + Thêm phòng trọ
            </button>
          </div>
          <RoomTable displayedRooms={filteredRooms} />
        </div>
      )}
      {page === 2 && (
        <div className="w-full bg-gray-100 p-6 rounded-lg shadow-lg text-black">
          <div className="flex items-center gap-5">
            <IoMdArrowRoundBack size={25} onClick={() => setPage(1)} />
            <h2 className="text-2xl font-bold">Thêm phòng trọ</h2>
          </div>
          <div className="mt-10">
            <div>
              <p className="text-xl font-medium mb-4">Ảnh phòng</p>
              <div className="flex space-x-2">
                {images.map((src, index) => (
                  <div
                    key={index}
                    className="w-[300px] h-[320px] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`Uploaded ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                {/* Nút thêm ảnh */}
                <label className="w-[200px] h-[120px] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer">
                  Add image
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleAddImage}
                  />
                </label>
              </div>
            </div>
            <span className="block h-[1px] bg-gray-500 w-full my-4"></span>
            <div>
              <p className="text-xl font-medium mb-4">Chi tiết phòng</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-base">Mã phòng</p>
                  <input
                    type="text"
                    placeholder="Mã phòng"
                    className="border p-2 rounded-md w-full mt-2"
                  />
                </div>
                <div>
                  <p>Tên phòng</p>
                  <input
                    type="text"
                    placeholder="Tên phòng"
                    className="border p-2 rounded-md w-full mt-2"
                  />
                </div>
                <div>
                  <p className="text-base">Mã map</p>
                  <select
                    className="border p-2 rounded-md w-full mt-2"
                    value={selectMap}
                    onChange={(e) => setSelectMap(Number(e.target.value))}
                  >
                    <option value="">-- Chọn mã map--</option>
                    {maps.map((dm) => (
                      <option key={dm.ma_map} value={dm.ma_map}>
                        {dm.ma_map}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p>Trạng thái</p>
                  <select className="border p-2 rounded-md w-full mt-2">
                    <option value={0}>Đã cho thuê</option>
                    <option value={1}>Còn trống</option>
                    <option value={2}>Đang sửa chữa</option>
                  </select>
                </div>
                <div>
                  <p>Danh mục</p>
                  <select
                    className="border p-2 rounded-md w-full mt-2"
                    value={selectedDanhMuc}
                    onChange={(e) => setSelectedDanhMuc(Number(e.target.value))}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {danhMuc.map((dm) => (
                      <option key={dm.ma_danh_muc} value={dm.ma_danh_muc}>
                        {dm.ten_danh_muc}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p>Số người</p>
                  <input
                    type="text"
                    placeholder="Số lượng người ở"
                    className="border p-2 rounded-md w-full mt-2"
                  />
                </div>
                <div>
                  <p>Giá tiền</p>
                  <input
                    type="text"
                    placeholder="Giá tiền"
                    className="border p-2 rounded-md w-full mt-2"
                  />
                </div>

                <div>
                  <p>Diện tích</p>
                  <input
                    type="text"
                    placeholder="Diện tích"
                    className="border p-2 rounded-md w-full mt-2"
                  />
                </div>

                <textarea
                  placeholder="Mô tả phòng"
                  className="border p-2 rounded-md w-full mt-2 col-span-2"
                ></textarea>
              </div>
            </div>
            <span className="block h-[1px] bg-gray-500 w-full my-4"></span>

            <div>
              <p>Thiết bị</p>
              <div className="grid grid-cols-4 gap-2">
                {/* {amenities.map((item, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>{item}</span>
                  </label>
                ))} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhongTroAdmin;
