import { useEffect, useState, useRef } from "react";
import anh1 from "../../assets/anh1.png";
import anh2 from "../../assets/anh2.png";
import anh3 from "../../assets/anh3.png";
import { FaArrowsAlt, FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";
import { useParams } from "react-router";
import { axiosInstance } from "../../../Axios";
import { CiHeart } from "react-icons/ci";
import { MdDeviceHub, MdLocalPolice } from "react-icons/md";
import ProductShowcase from "../../component/ProductShowcase";
import { useSelector } from "react-redux";

function RoomDetails() {
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [trangthai, setTrangthai] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [roomSame, setRoomSame] = useState([]);
  const [anh, setAnh] = useState([]);
  const statusMapping = {
    1: { text: "Còn trống", color: "green" },
    0: { text: "Đã có người thuê", color: "red" },
    2: { text: "Đang sửa chữa", color: "orange" },
    3: { text: "Chờ xác nhận", color: "yellow" },
    4: { text: "Đã được đặt", color: "blue" },
    5: { text: "Không cho thuê", color: "gray" },
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.post(`/phongTro/detail/${id}`);
      setData(res.data.data);
      setAnh(res.data.data.anh);
      const status = res.data.data.trang_thai;
      const statusInfo = statusMapping[status] || {
        text: "Trạng thái không xác định",
        color: "black",
      };
      const data = await axiosInstance.get("/phongTro/get");
      const filteredProducts = data.data.data.filter(
        (product) => product.ma_danh_muc === res.data.data.ma_danh_muc
      );
      setRoomSame(filteredProducts);
      setTrangthai(statusInfo.text);
      setStatusColor(statusInfo.color);
    };
    fetchData();
  }, [id]);
  const [nut, setNut] = useState("Tổng quan");
  // Tạo các ref cho từng phần nội dung
  const overviewRef = useRef(null);
  const amenitiesRef = useRef(null);
  const nearbyRef = useRef(null);
  const addressRef = useRef(null);
  // Hàm xử lý cuộn xuống khi chọn tab
  const handleScroll = (tab) => {
    setNut(tab);
    let ref;
    switch (tab) {
      case "Tổng quan":
        ref = overviewRef;
        break;
      case "Tiện nghi":
        ref = amenitiesRef;
        break;
      case "Phòng trọ cùng khu vực":
        ref = nearbyRef;
        break;
      case "Địa chỉ":
        ref = addressRef;
        break;
      default:
        ref = null;
    }
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const tabs = ["Tổng quan", "Tiện nghi", "Phòng trọ cùng khu vực", "Địa chỉ"];
  const handlePile = async (e) => {
    await axiosInstance.post("/hoadon/Create", { ma_phong: e });
  };
  return (
    <div className="w-full">
      {data ? (
        <div className="max-w-[1920px] mx-auto px-[150px] mt-[94px]">
          <div className="flex gap-[26px]">
            <img
              src={anh[0]?.image_url}
              alt=""
              className="w-[1072px] h-[446px] object-cover"
            />

            <div>
              <img
                src={anh[1]?.image_url}
                alt=""
                className="w-[523px] h-[215px] object-cover"
              />
              <img
                src={anh3}
                alt=""
                className="w-[523px] h-[215px] object-cover"
              />
            </div>
          </div>

          {/* Tabs */}
          <ul className="flex my-[34px] border-b-2 border-gray-500 w-full">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`py-[10px] px-[14px] cursor-pointer ${
                  nut === tab
                    ? "text-black border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => handleScroll(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>

          <div className="flex justify-between mt-[33px]">
            <div>
              <h1 className="font-bold text-4xl">{data.ten_phong_tro}</h1>
              <div className="flex gap-10">
                <div className="flex items-center gap-5 mt-[33px] text-[#23274A] font-medium text-2xl">
                  <FaUserFriends className="font-medium text-2xl" />
                  <p>{data.so_luong_nguoi}</p>
                </div>
                <div className="flex items-center gap-2 mt-[33px] text-[#23274A] font-medium text-2xl">
                  <FaArrowsAlt className="font-medium text-2xl" />
                  <p>{data.dien_tich}</p>
                </div>

                <p
                  style={{ color: statusColor }}
                  className="font-medium text-2xl mt-[33px]"
                >
                  {trangthai}
                </p>
              </div>
            </div>
            <div className="text-end">
              <p className="text-2xl font-bold text-yellow-500">
                {data.gia_tien} VND
              </p>
              <div className="flex items-center gap-4 mt-4">
                <button className="border border-gray-500 p-3">
                  <CiHeart className="text-xl" />
                </button>
                <button
                  className="bg-[#23284C] font-medium py-3 px-8 text-white rounded-md"
                  onClick={() => handlePile(id)}
                >
                  Đặt cọc
                </button>
              </div>
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="flex gap-[10px] items-center mt-[33px]">
            <div className="flex gap-[10px] items-center ">
              <FaMapMarkerAlt className="text-[#23274A] text-lg" />
              <p className="text-xl font-medium">1 Fullerton Square -</p>
            </div>
            <span className="text-xl font-medium text-[#2F80ED] cursor-pointer">
              Hiển thị bản đồ
            </span>
          </div>

          {/* Nội dung chi tiết */}
          <div className="mt-[33px] flex justify-between">
            <div>
              <h2 ref={overviewRef} className="text-3xl font-semibold">
                Tổng quan
              </h2>
              <p className="mt-[33px] text-lg max-w-[900px]">{data.mo_ta}</p>
            </div>
            <div className="flex flex-col bg-white max-w-[458px] max-h-[451px] py-6 px-7">
              <h3 className="font-semibold text-2xl">Điểm nổi bật</h3>
              <ul className="mt-10 flex flex-col gap-10">
                <li className="flex gap-4">
                  <MdLocalPolice size={30} color="green" />
                  <p>
                    Có hệ thống camera an ninh, bảo vệ 24/7 hoặc khu vực an
                    toàn.
                  </p>
                </li>
                <li className="flex gap-4 ">
                  <FaMapMarkerAlt size={30} color="green" />
                  <p>
                    Gần các khu vực tiện ích như chợ, siêu thị, trường học, bệnh
                    viện, giao thông công cộng.
                  </p>
                </li>
                <li className="flex gap-4">
                  <MdDeviceHub size={30} color="green" />
                  <p>
                    Giường, tủ, quạt, máy lạnh, bếp nấu ăn, WC riêng hoặc chung,
                    internet, truyền hình cáp.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-[33px]">
            <h2 ref={amenitiesRef} className="text-3xl font-semibold">
              Tiện nghi
            </h2>
          </div>
          <div className="mt-[33px]">
            <h2 ref={nearbyRef} className="text-3xl font-semibold">
              Phòng trọ cùng khu vực
            </h2>
            <ProductShowcase data={roomSame} limit={5} />
          </div>
          <h2 ref={addressRef} className="text-3xl font-semibold mt-[33px]">
            Địa chỉ
          </h2>
        </div>
      ) : (
        <div>Error</div>
      )}
    </div>
  );
}

export default RoomDetails;
