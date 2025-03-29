import { useState } from "react";
import { FaFan, FaTv, FaLaptop, FaBed, FaCouch, FaWifi } from "react-icons/fa";
import {
  MdOutlineMicrowave,
  MdBalcony,
  MdOutlineMediaBluetoothOn,
} from "react-icons/md";
import { BiCabinet } from "react-icons/bi";
import { LuLamp } from "react-icons/lu";
import { FaGlassWaterDroplet } from "react-icons/fa6";
import { TbAirConditioning } from "react-icons/tb";
import { BiSolidFridge } from "react-icons/bi";
import { GiWashingMachine } from "react-icons/gi";
import { MdGasMeter } from "react-icons/md";

// Danh sách icon theo tên thiết bị
const deviceIcons = {
  "Quạt hơi nước": <FaFan />,
  "Điều hòa": <TbAirConditioning />,
  "Tủ lạnh": <BiSolidFridge />,
  "Máy giặt": <GiWashingMachine />,
  "Bình nóng lạnh": <FaGlassWaterDroplet />,
  "Bếp gas": <MdGasMeter />,
  "Lò vi sóng": <MdOutlineMicrowave />,
  "Nồi cơm điện": <MdOutlineMicrowave />,
  "Ấm đun nước": <MdOutlineMicrowave />,
  "Máy lọc nước": <MdOutlineMicrowave />,
  "Tủ quần áo": <BiCabinet />,
  Giường: <FaBed />,
  "Bàn ghế": <FaCouch />,
  "Kệ sách": <FaCouch />,
  "Đèn ngủ": <LuLamp />,
  Tivi: <FaTv />,
  Wifi: <FaWifi />,
  "Loa Bluetooth": <MdOutlineMediaBluetoothOn />,
  "Rèm cửa": <FaCouch />,
  "Ban công": <MdBalcony />,
  "Máy chiếu": <FaLaptop />,
};
export default function DeviceSelector({ data }) {
  return (
    <div className="p-4">
      {data ? (
        <ul className="grid grid-cols-5 gap-y-5">
          {data.map((item) => (
            <li
              key={item._id}
              className="flex items-center gap-2  px-[51px] py-[21px] bg-white max-w-[257px] max-h-[62px]"
            >
              <p className="text-xl text-center text-[#229935]">
                {deviceIcons[item.ten_thiet_bi]}
              </p>
              <p className="text-center">{item.ten_thiet_bi}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div></div>
      )}
    </div>
  );
}
