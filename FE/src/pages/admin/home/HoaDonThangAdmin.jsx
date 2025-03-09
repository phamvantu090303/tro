import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../Axios";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

function HoaDonThangAdmin() {
  const [hoaDon, setHoaDon] = useState([]);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(null);
  const [maPhong, setMaPhong] = useState("");
  const [idUsers, setIdUsers] = useState("");
  const [thang, setThang] = useState("");
  const [updateData, setUpdateData] = useState({
    ma_phong: "",
    id_users: "",
    chi_so_dien_thang_nay: "",
    chi_so_dien_thang_truoc: "",
    so_dien_tieu_thu: "",
    tien_dien: "",
    tien_phong: "",
    tong_tien: "",
    trang_thai: "",
    ngay_tao_hoa_don: "",
  });

  // Lấy danh sách hóa đơn
  const fetchReloadHoaDon = async () => {
    try {
      const res = await axiosInstance.get("/hoa-don-thang/getHoaDon");
      setHoaDon(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReloadHoaDon();
  }, []);

  // Cập nhật trạng thái hoặc thông tin hóa đơn
  const handleUpdateTrangthai = async (id, updatedData) => {
    try {
      await axiosInstance.put(`/hoa-don-thang/update/${id}`, updatedData);
      fetchReloadHoaDon();
    } catch (error) {
      console.log(error);
    }
  };

  // Tạo hóa đơn mới
  const handleCreate = async () => {
    try {
      await axiosInstance.post("/hoa-don-thang/create", {
        ma_phong: maPhong,
        id_users: idUsers,
        thang,
      });
      fetchReloadHoaDon();
      setModalCreate(false);
      setMaPhong("");
      setIdUsers("");
      setThang("");
    } catch (error) {
      console.log(error);
    }
  };

  // Xóa hóa đơn theo ID
  const handleDeleteById = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hóa đơn này?")) {
      try {
        await axiosInstance.delete(`/hoa-don-thang/delete/${id}`);
        alert("Hóa đơn tháng đã xóa thành công!");
        fetchReloadHoaDon();
      } catch (error) {
        console.log("Không xóa được hóa đơn:", error);
      }
    }
  };

  // Mở modal cập nhật và điền dữ liệu hiện tại
  const openUpdateModal = (item) => {
    setUpdateData({
      ma_phong: item.ma_phong,
      id_users: item.id_users,
      chi_so_dien_thang_nay: item.chi_so_dien_thang_nay,
      chi_so_dien_thang_truoc: item.chi_so_dien_thang_truoc,
      so_dien_tieu_thu: item.so_dien_tieu_thu,
      tien_dien: item.tien_dien,
      tien_phong: item.tien_phong,
      tong_tien: item.tong_tien,
      trang_thai: item.trang_thai,
      ngay_tao_hoa_don: item.ngay_tao_hoa_don,
    });
    setModalUpdate(item._id);
  };

  // Xử lý cập nhật hóa đơn
  const handleUpdate = async () => {
    try {
      await handleUpdateTrangthai(modalUpdate, updateData);
      setModalUpdate(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản Lý Hóa Đơn Tháng</h1>

        {/* Thanh tìm kiếm và nút tạo */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm hóa đơn..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setModalCreate(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Tạo Hóa Đơn
          </button>
        </div>

        {/* Tiêu đề bảng */}
        <div className="grid grid-cols-11 gap-4 bg-gray-700 text-white p-4 rounded-t-lg font-semibold text-sm">
          <p>Mã Phòng</p>
          <p>ID User</p>
          <p>Điện Tháng Này</p>
          <p>Điện Tháng Trước</p>
          <p>Số Điện Tiêu Thụ</p>
          <p>Tiền Điện</p>
          <p>Tiền Phòng</p>
          <p>Tổng Tiền</p>
          <p>Ngày Tạo</p>
          <p>Trạng Thái</p>
          <p>Hành Động</p>
        </div>

        {/* Danh sách hóa đơn */}
        <div className="divide-y divide-gray-200">
          {hoaDon.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-11 gap-4 p-4 hover:bg-gray-50 transition duration-200"
            >
              <p className="text-sm text-gray-700">{item.ma_phong}</p>
              <p className="text-sm text-gray-700">{item.id_users}</p>
              <p className="text-sm text-gray-700">{item.chi_so_dien_thang_nay}</p>
              <p className="text-sm text-gray-700">{item.chi_so_dien_thang_truoc}</p>
              <p className="text-sm text-gray-700">{item.so_dien_tieu_thu}</p>
              <p className="text-sm text-gray-700">{item.tien_dien}</p>
              <p className="text-sm text-gray-700">{item.tien_phong}</p>
              <p className="text-sm text-gray-700">{item.tong_tien}</p>
              <p className="text-sm text-gray-700">
                {new Date(item.ngay_tao_hoa_don).toLocaleDateString()}
              </p>
              <select
                value={item.trang_thai}
                onChange={(e) =>
                  handleUpdateTrangthai(item._id, { trang_thai: e.target.value })
                }
                className="text-sm border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="chưa thanh toán">Chưa thanh toán</option>
                <option value="đã thanh toán">Đã thanh toán</option>
              </select>
              <div className="flex items-center gap-2">
                <AiOutlineEdit
                  color="blue"
                  size={20}
                  onClick={() => openUpdateModal(item)}
                  className="cursor-pointer hover:scale-110 transition duration-200"
                  title="Cập nhật hóa đơn"
                />
                <AiOutlineDelete
                  color="red"
                  size={20}
                  onClick={() => handleDeleteById(item._id)}
                  className="cursor-pointer hover:scale-110 transition duration-200"
                  title="Xóa hóa đơn"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Modal tạo hóa đơn */}
        {modalCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Tạo Hóa Đơn Tháng</h2>
                <button
                  onClick={() => setModalCreate(false)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Đóng
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Mã phòng"
                  value={maPhong}
                  onChange={(e) => setMaPhong(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="ID người dùng"
                  value={idUsers}
                  onChange={(e) => setIdUsers(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Tháng (YYYY-MM)"
                  value={thang}
                  onChange={(e) => setThang(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleCreate}
                  className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal cập nhật hóa đơn */}
        {modalUpdate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Cập Nhật Hóa Đơn</h2>
                <button
                  onClick={() => setModalUpdate(null)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Đóng
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Mã phòng"
                  value={updateData.ma_phong}
                  onChange={(e) => setUpdateData({ ...updateData, ma_phong: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="ID người dùng"
                  value={updateData.id_users}
                  onChange={(e) => setUpdateData({ ...updateData, id_users: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Chỉ số điện tháng này"
                  value={updateData.chi_so_dien_thang_nay}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, chi_so_dien_thang_nay: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Chỉ số điện tháng trước"
                  value={updateData.chi_so_dien_thang_truoc}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, chi_so_dien_thang_truoc: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Số điện tiêu thụ"
                  value={updateData.so_dien_tieu_thu}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, so_dien_tieu_thu: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Tiền điện"
                  value={updateData.tien_dien}
                  onChange={(e) => setUpdateData({ ...updateData, tien_dien: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Tiền phòng"
                  value={updateData.tien_phong}
                  onChange={(e) => setUpdateData({ ...updateData, tien_phong: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Tổng tiền"
                  value={updateData.tong_tien}
                  onChange={(e) => setUpdateData({ ...updateData, tong_tien: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={updateData.trang_thai}
                  onChange={(e) => setUpdateData({ ...updateData, trang_thai: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="chưa thanh toán">Chưa thanh toán</option>
                  <option value="đã thanh toán">Đã thanh toán</option>
                </select>
                <button
                  onClick={handleUpdate}
                  className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Cập Nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HoaDonThangAdmin;