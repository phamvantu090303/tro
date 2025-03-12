import React from "react";
import { FaUserFriends } from "react-icons/fa";
import { CiCircleMore } from "react-icons/ci";
import Pagination from "../Phantrang/Pagination";
import usePagination from "../../hook/usePagination";
import { useNavigate } from "react-router";
import { MdOutlineDelete } from "react-icons/md";
function RoomTable({
  displayedRooms,
  roomsPerPage,
  headers,
  title,
  handleNavigate,
  renderStatus,
  handleDelete,
}) {
  const { currentPage, totalPages, currentItems, handlePageChange } =
    usePagination(displayedRooms, roomsPerPage);

  //format Ngày sinh sang định dạng dd/mm/yyyy
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  //format email thành định dạng hi****@gmail.com
  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    return `${name[0]}***@${domain}`;
  };
  //format ID quyen thanh dinh dang 12b453***23cb
  const maskID = (idquyen) => {
    if (idquyen.length > 9) {
      return `${idquyen.slice(0, 3)}**********${idquyen.slice(-6)}`;
    }
    return idquyen; // Trường hợp mã phòng quá ngắn thì giữ nguyên
  };
  //format định dạng trạng thái
  const Availability = {
    0: { text: "Đã cho thuê", bgColor: "bg-red-500" },
    1: { text: "Phòng còn trống", bgColor: "bg-green-500" },
    2: { text: "Đang sửa chữa", bgColor: "bg-yellow-500" },
  };

  //mặc định cho trạng thái nếu không truyền sang
  const defaultRenderStatus = (status) => (
    <span
      className={`px-2 py-1 text-white text-sm rounded-lg ${
        Availability[status]?.bgColor || "bg-red-500"
      }`}
    >
      {Availability[status]?.text || "Không xác định"}
    </span>
  );

  //return ra giao diện khi có key
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
    if (key === "ngay_sinh") return formatDate(room[key]);
    if (key === "email") return maskEmail(room[key]);
    if (key === "id_quyen") return maskID(room[key]);
    if (key === "image_url" && room[key]) {
      return (
        <img
          src={room[key]}
          alt="Hình ảnh"
          className="w-[50%] h-24 object-cover rounded"
        />
      );
    }
    return room[key] || "N/A";
  };

  const renderCell = (item, key) => defaultRenderCell(item, key);
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full border border-gray-500 mt-4">
      <h3 className="text-xl font-medium mb-6">{title}</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            {headers.map((header, index) => (
              <th key={index} className="p-3">
                {header.label}
              </th>
            ))}
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((room, index) => (
            <tr key={index} className="border-b hover:bg-gray-100 py-5">
              {headers.map((header, idx) => (
                <td key={idx} className="p-3">
                  {renderCell(room, header.key)}
                </td>
              ))}
              <td className="p-3 flex gap-3">
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() =>
                    handleNavigate(`/admin/home/detailUser/${room._id}`)
                  }
                >
                  👁️
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-center">
                  <MdOutlineDelete
                    size={30}
                    onClick={() => handleDelete(room)}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default RoomTable;
