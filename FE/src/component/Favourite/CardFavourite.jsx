import { useEffect, useState } from "react";
import { FaArrowsAlt, FaUserFriends } from "react-icons/fa";

function CardFavourite({
  price,
  title,
  img,
  number,
  diachi,
  dientich,
  noidung,
  trangthai,
}) {
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
  return (
    <div className="flex gap-8 px-12 py-5 bg-white ">
      <img src={img} alt="" className="w-[329px] h-[226px] " />
      <div className="flex justify-between w-full">
        <div className="flex flex-col justify-between">
          <h6 className="text-xl font-semibold">{title}</h6>
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
          <button className="bg-customBg text-white px-[31px] py-[11px] rounded-lg">
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
