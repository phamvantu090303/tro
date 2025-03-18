// src/component/admin/RoomTable.jsx
import React from "react";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import Pagination from "../Phantrang/Pagination";
import usePagination from "../../hook/usePagination";

function RoomTable({
  displayedRooms,
  roomsPerPage,
  headers,
  title,
  setStep,
  renderStatus,
  handleDelete,
}) {
  const { currentPage, totalPages, currentItems, handlePageChange } =
    usePagination(displayedRooms, roomsPerPage, 330, 20);

  // Format ngày sinh sang định dạng dd/mm/yyyy
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  // Format email thành định dạng hi****@gmail.com
  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    return `${name[0]}***@${domain}`;
  };

  // Format ID quyền thành định dạng 12b453***23cb
  const maskID = (idquyen) => {
    if (idquyen.length > 9) {
      return `${idquyen.slice(0, 3)}**********${idquyen.slice(-6)}`;
    }
    return idquyen;
  };

  // Định dạng trạng thái
  const Availability = {
    0: { text: "Đã cho thuê", bgColor: "bg-red-500" },
    1: { text: "Phòng còn trống", bgColor: "bg-green-500" },
    2: { text: "Đang sửa chữa", bgColor: "bg-yellow-500" },
  };

  // Mặc định cho trạng thái nếu không truyền renderStatus
  const defaultRenderStatus = (status) => (
    <span
      className={`px-2 py-1 text-white text-sm rounded-lg ${
        Availability[status]?.bgColor || "bg-red-500"
      }`}
    >
      {Availability[status]?.text || "Không xác định"}
    </span>
  );

  // Render ô trong bảng
  const defaultRenderCell = (room, key) => {
    if (key === "so_luong_nguoi") {
      return (
        <div className="flex items-center">
          <span className="mr-1 text-lg">
            <FaUserFriends size={20} />
          </span>{" "}
          {room[key]}
        </div>
      );
    }
    if (key === "trang_thai") {
      return renderStatus
        ? renderStatus(room)
        : defaultRenderStatus(room.trang_thai);
    }
    if (key === "is_block") {
      return renderStatus
        ? renderStatus(room)
        : defaultRenderStatus(room.is_block);
    }
    if (key === "ngay_sinh" || key === "timestamp")
      return formatDate(room[key]);
    if (key === "email") return maskEmail(room[key]);
    if (key === "id_quyen") return maskID(room[key]);
    if (key === "total_cost")
      return (
        <div className="flex items-center">
          <span className="mr-1 text-lg">{room[key]} VND</span>
        </div>
      );

    if (key === "image_url" && room[key]) {
      return (
        <img
          src={room[key]}
          alt="Hình ảnh"
          className="md:w-[50%] md:h-24 object-cover rounded w-16 h-16"
        />
      );
    }
    return room[key] || "N/A";
  };

  const renderCell = (item, key) => defaultRenderCell(item, key);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full border border-gray-500 mt-4 h-full">
      <h3 className="text-xl font-medium mb-6">{title}</h3>
      {/* Bảng cho desktop */}
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              {headers.map((header, index) => (
                <th key={index} className="p-3 text-sm 2xl:text-base">
                  {header.label}
                </th>
              ))}
              <th className="p-3 text-sm 2xl:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((room, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-100 transition-colors duration-200"
              >
                {headers.map((header, idx) => (
                  <td key={idx} className="p-3 text-sm 2xl:text-base">
                    {renderCell(room, header.key)}
                  </td>
                ))}
                <td className="p-3 flex gap-3">
                  <button
                    className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    onClick={() =>
                      setStep((prev) => ({
                        ...prev,
                        page: 2,
                        id: room._id,
                      }))
                    }
                  >
                    👁️
                  </button>
                  <button className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                    <MdOutlineDelete
                      size={24}
                      onClick={() => handleDelete(room)}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Danh sách dạng card cho mobile */}
      <div className="md:hidden space-y-4">
        {currentItems.map((room, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            {headers.map((header, idx) => (
              <div key={idx} className="flex justify-between py-1">
                <span className="font-medium text-sm">{header.label}:</span>
                <span className="text-sm">{renderCell(room, header.key)}</span>
              </div>
            ))}
            <div className="flex justify-end gap-3 mt-2">
              <button
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                onClick={() => setStep(2)}
              >
                👁️
              </button>
              <button className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                <MdOutlineDelete size={24} onClick={() => handleDelete(room)} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default RoomTable;
