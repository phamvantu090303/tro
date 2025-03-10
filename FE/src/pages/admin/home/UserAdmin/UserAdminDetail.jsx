import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../../../Axios";
import { useParams } from "react-router";
import { FaRegUserCircle, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const UserAdminDetail = () => {
  const [dataDetail, setDataDetail] = useState({});
  const { id } = useParams();
  const [dataHopdong, setDataHopdong] = useState({});
  const [trangthai, setTrangthai] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("vi-VN") : "";

  const statusMapping = {
    da_ky: { text: "Đã ký", color: "text-green-500" },
    0: { text: "Hết hạn hợp đồng", color: "text-red-500" },
  };

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await axiosInstance.get(`/auth/Detail/${id}`);
      setDataDetail(res.data.data);

      const formattedHopdong = res.data.data.phongTro?.hopdongs
        ? {
            ...res.data.data.phongTro.hopdongs,
            start_date: formatDate(res.data.data.phongTro.hopdongs.start_date),
            end_date: formatDate(res.data.data.phongTro.hopdongs.end_date),
          }
        : null;
      const status = res.data.data.phongTro.hopdongs.trang_thai;
      const statusInfo = statusMapping[status] || {
        text: "Trạng thái không xác định",
        color: "black",
      };
      setDataHopdong(formattedHopdong);
      setTrangthai(statusInfo.text);
      setStatusColor(statusInfo.color);
    };

    fetchDetail();
  }, [id]);

  return (
    <div className="w-full bg-gray-300 p-6 rounded-lg shadow-lg text-black">
      {dataDetail && (
        <div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-32 mb-6">
            <div className="w-full md:w-1/3 bg-white flex flex-col items-center px-6 py-4">
              <div className="relative w-full h-32">
                <div className="relative w-full h-32 bg-gray-400 rounded-t-lg">
                  <FaRegUserCircle className="w-32 h-32 absolute top-[95%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex flex-col mt-20 text-center">
                <h2 className="text-xl font-bold">{dataDetail.ho_va_ten}</h2>
                <div className="mt-10 space-y-5">
                  <p className="flex gap-5 text-lg ">
                    <FaPhoneAlt
                      size={40}
                      className="p-2 rounded-full border border-gray-500"
                    />
                    {dataDetail.so_dien_thoai}
                  </p>
                  <p className="flex gap-5 text-lg ">
                    <MdEmail
                      size={40}
                      className="p-2 rounded-full border border-gray-500"
                    />
                    {dataDetail.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md w-full">
              <h3 className="text-lg font-semibold mb-4">Phòng trọ hiện tại</h3>
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div>
                  <p className="text-lg">
                    Mã phòng:{" "}
                    <span className="font-medium">
                      {dataDetail.phongTro?.ma_phong}
                    </span>
                  </p>
                  <p className="text-lg">
                    Tên phòng:{" "}
                    <span className="font-medium">
                      {dataDetail.phongTro?.ten_phong_tro}
                    </span>
                  </p>
                  <p className="text-lg">
                    Số lượng người:{" "}
                    <span className="font-medium">
                      {dataDetail.phongTro?.so_luong_nguoi}
                    </span>
                  </p>
                  <p className="text-lg">
                    Mô tả:{" "}
                    <span className="font-medium">
                      {dataDetail.phongTro?.mo_ta}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-medium text-xl">Thiết bị phòng:</p>
                  <ul className="list-disc pl-6">
                    {dataDetail.phongTro?.thietbi.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item.ten_thiet_bi}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex gap-5 overflow-auto mt-10">
                {dataDetail.phongTro?.anhChiTiet.map((image, index) => (
                  <img
                    key={index}
                    src={image.image_url}
                    alt={`Room ${index + 1}`}
                    className="w-full h-52 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Hợp đồng phòng trọ</h3>
            <div className="hidden md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Mã Hợp Đồng</th>
                    <th className="p-2">Tên hợp đồng</th>
                    <th className="p-2">Ngày Bắt Đầu</th>
                    <th className="p-2">Ngày kết thúc</th>
                    <th className="p-2">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {dataHopdong && (
                    <tr key={dataHopdong._id} className="border-t">
                      <td className="p-2">{dataHopdong._id}</td>
                      <td className="p-2">{dataHopdong.ten_hop_dong}</td>
                      <td className="p-2">{dataHopdong.start_date}</td>
                      <td className="p-2">{dataHopdong.end_date}</td>
                      <td className={`p-2 ${statusColor}`}>{trangthai}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="md:hidden">
              {dataHopdong && (
                <div key={dataHopdong._id} className="border-b pb-4 mb-4">
                  <p className="py-3">
                    <strong>Mã Hợp Đồng:</strong> {dataHopdong._id}
                  </p>
                  <p className="py-3">
                    <strong>Tên Phòng:</strong> {dataHopdong.ten_hop_dong}
                  </p>
                  <p className="py-3">
                    <strong>Ngày Bắt Đầu:</strong> {dataHopdong.start_date}
                  </p>
                  <p className="py-3">
                    <strong>Thời Hạn:</strong> {dataHopdong.end_date}
                  </p>
                  <p className="py-3" style={{ color: statusColor }}>
                    <strong>Trạng Thái:</strong>
                    {trangthai}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAdminDetail;
