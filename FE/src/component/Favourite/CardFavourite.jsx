import { useEffect, useState } from "react";
import { FaArrowsAlt, FaUserFriends } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { axiosInstance } from "../../../Axios";

function CardFavourite({
  id,
  price,
  title,
  img,
  number,
  diachi,
  dientich,
  noidung,
  trangthai,
  reloadData,
}) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [colorStatus, setColorStatus] = useState("");
  const statusMapping = {
    1: { text: "Còn trống", color: "green" },
    0: { text: "Đã có người thuê", color: "red" },
    2: { text: "Đang sửa chữa", color: "orange" },
    3: { text: "Chờ xác nhận", color: "yellow" },
    4: { text: "Đã được đặt", color: "blue" },
    5: { text: "Không cho thuê", color: "gray" },
  };

  useEffect(() => {
    if (!trangthai) return;
    const status = statusMapping[trangthai] || {
      text: "Trạng thái không xác định",
      color: "black",
    };
    setStatus(status.text);
    setColorStatus(status.color);
  });

  const handleCard = async (e) => {
    try {
      navigate(`/details/${e}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/yeu-thich/delete/${user.id}`);
      reloadData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-8 px-12 py-5 bg-white hover:bg-black/10 cursor-pointer rounded-lg z-10">
      <img src={img} alt="" className="w-[329px] h-[226px] " />
      <div className="flex justify-between w-full">
        <div className="flex flex-col justify-between">
          <h6 className="text-xl font-semibold" onClick={() => handleCard(id)}>
            {title}
          </h6>
          <p className="text-base text-gray-500 mt-4">{noidung}</p>
          <div>
            <p
              style={{ color: colorStatus }}
              className="font-medium text-xl sm:text-lg"
            >
              {status}
            </p>
            <p className="mt-4">Khu vực {diachi}</p>
          </div>
        </div>
        <div className="flex flex-col justify-between text-right">
          <button
            className="bg-customBg text-white px-[31px] py-[11px] rounded-lg z-50"
            onClick={handleDelete}
          >
            Hủy yêu thích
          </button>
          <div>
            <div className="flex gap-3 justify-end">
              <p className="flex items-center gap-2 xl:text-base">
                <FaUserFriends className="2xl:text-xl text-base text-gray-600" />
                {number}
              </p>
              <p className="flex items-center gap-2 xl:text-base">
                <FaArrowsAlt className="2xl:text-xl text-base text-gray-600" />
                {dientich}
              </p>
            </div>
            <p className="text-bold text-xl mt-4 text-yellow-500">${price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardFavourite;
