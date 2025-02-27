import React, { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { CiCircleMore } from "react-icons/ci";

function RoomTable({ displayedRooms }) {
  const roomsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Tính tổng số trang (tránh chia cho 0)
  const totalPages = Math.max(
    1,
    Math.ceil(displayedRooms.length / roomsPerPage)
  );

  // Cắt danh sách phòng theo trang hiện tại
  const startIndex = (currentPage - 1) * roomsPerPage;
  const currentRooms = displayedRooms.slice(
    startIndex,
    startIndex + roomsPerPage
  );

  // Chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const Availability = {
    0: { text: "Đã cho thuê", bgColor: "bg-red-500" },
    1: { text: "Phòng còn trống", bgColor: "bg-green-500" },
    2: { text: "Đang sửa chữa", bgColor: "bg-yellow-500" },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full border border-gray-500 mt-4">
      <h3 className="text-xl font-medium mb-6">Tất cả phòng trọ</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Mã phòng</th>
            <th className="p-3">Tên phòng trọ</th>
            <th className="p-3">Mã danh mục</th>
            <th className="p-3">Số người</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3">Mô tả</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody className="">
          {currentRooms.map((room, index) => (
            <tr key={index} className="border-b hover:bg-gray-100 py-5 ">
              <td className="p-3">{room.ma_phong}</td>
              <td className="p-3">{room.ten_phong_tro}</td>
              <td className="p-3">{room.ma_danh_muc}</td>
              <td className="p-3 flex items-center">
                <span className="mr-1 text-lg">
                  <FaUserFriends size={20} />
                </span>{" "}
                {room.so_luong_nguoi}
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 text-white text-sm rounded-lg ${
                    Availability[room.trang_thai]?.bgColor || "bg-red-500"
                  }`}
                >
                  {Availability[room.trang_thai]?.text || "Không xác định"}
                </span>
              </td>
              <td className="p-3">{room.mo_ta}</td>
              <td className="p-3 flex gap-3">
                <button className="text-gray-600 hover:text-gray-800">
                  👁️
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-center">
                  <CiCircleMore size={30} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 border rounded-full px-2 py-1 mt-4">
          <button
            className={`px-3 py-1 rounded-full ${
              currentPage === 1
                ? "text-black cursor-not-allowed"
                : "text-gray-600"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-blue-700 text-white font-bold"
                    : "border text-brown-600"
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            className={`px-3 py-1 rounded-full ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-brown-600"
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default RoomTable;
