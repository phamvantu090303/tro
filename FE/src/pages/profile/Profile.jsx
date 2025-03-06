import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OpenModalForm } from "../../Store/filterModalForm";
import ModalUser from "../../component/User/ModalUser";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [chucnang, setChucnang] = useState("Thông tin cá nhân");
  const dispatch = useDispatch();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleOpenModal = async () => {
    dispatch(OpenModalForm({ modalType: "repair" }));
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-[100px] lg:px-[150px] mt-10 mb-20">
        <div className="flex gap-10">
          {/* Sidebar */}
          <div className="w-1/4 bg-white shadow-md rounded-lg p-6">
            {/* Ảnh đại diện */}
            <div className="flex flex-col items-center text-center mb-6">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover mb-3"
              />
              <p className="text-lg font-semibold">{user.username}</p>
              <p className="text-gray-500">
                Ngày sinh {formatDate(user.ngaysinh)}
              </p>
            </div>

            {/* Menu Sidebar */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-2">Người dùng</h3>
              <p
                className={`cursor-pointer p-2 rounded-lg ${
                  chucnang === "Thông tin cá nhân"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setChucnang("Thông tin cá nhân")}
              >
                Thông tin cá nhân
              </p>

              <h3 className="text-xl font-bold mt-4 mb-2">Phòng trọ của tôi</h3>
              {["Sửa chữa", "Yêu cầu", "Hóa đơn", "Hợp đồng"].map((item) => (
                <p
                  key={item}
                  className={`cursor-pointer p-2 rounded-lg ${
                    chucnang === item
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => setChucnang(item)}
                >
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* Nội dung chính */}
          <div className="w-3/4 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{chucnang}</h2>
            <div className="text-gray-700">
              {/* Thông tin cá nhân */}
              {chucnang === "Thông tin cá nhân" && (
                <div>
                  <p>Email: {user.email}</p>
                  <p>Số điện thoại: {user.sdt}</p>
                  <p>Địa chỉ: {user.diachi}</p>
                </div>
              )}

              {/* Sửa chữa */}
              {chucnang === "Sửa chữa" && (
                <div>
                  <p className="mb-4">Danh sách yêu cầu sửa chữa:</p>
                  <table className="w-full border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-2">Ngày gửi</th>
                        <th className="border p-2">Mô tả</th>
                        <th className="border p-2">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2">01/03/2024</td>
                        <td className="border p-2">Hỏng vòi nước</td>
                        <td className="border p-2 text-red-500">Đang xử lý</td>
                      </tr>
                    </tbody>
                  </table>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() =>
                      dispatch(OpenModalForm({ modalType: "repair" }))
                    }
                  >
                    Gửi yêu cầu mới
                  </button>
                </div>
              )}

              {/* Yêu cầu */}
              {chucnang === "Yêu cầu" && (
                <div>
                  <p className="mb-4">Lịch sử yêu cầu của bạn:</p>
                  <ul className="list-disc pl-6">
                    <li>Xin gia hạn hợp đồng - Đang chờ xét duyệt</li>
                    <li>Xin đổi phòng - Đã xử lý</li>
                  </ul>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() =>
                      dispatch(OpenModalForm({ modalType: "payment" }))
                    }
                  >
                    Tạo yêu cầu mới
                  </button>
                </div>
              )}

              {/* Hóa đơn */}
              {chucnang === "Hóa đơn" && (
                <div>
                  <p className="mb-4">Danh sách hóa đơn:</p>
                  <table className="w-full border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-2">Tháng</th>
                        <th className="border p-2">Tổng tiền</th>
                        <th className="border p-2">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2">02/2024</td>
                        <td className="border p-2">2,500,000 VNĐ</td>
                        <td className="border p-2 text-green-500">
                          Đã thanh toán
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">03/2024</td>
                        <td className="border p-2">2,700,000 VNĐ</td>
                        <td className="border p-2 text-red-500">
                          Chưa thanh toán
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() =>
                      dispatch(OpenModalForm({ modalType: "payment" }))
                    }
                  >
                    Thanh toán
                  </button>
                </div>
              )}

              {/* Hợp đồng */}
              {chucnang === "Hợp đồng" && (
                <div>
                  <p className="mb-4">Chi tiết hợp đồng thuê:</p>
                  <p>
                    <strong>Ngày ký:</strong> 01/01/2024
                  </p>
                  <p>
                    <strong>Ngày hết hạn:</strong> 01/01/2025
                  </p>
                  <p>
                    <strong>Giá thuê:</strong> 2,500,000 VNĐ / tháng
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> Đang hiệu lực
                  </p>
                  <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                    Yêu cầu hủy hợp đồng
                  </button>
                </div>
              )}
              <ModalUser />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
