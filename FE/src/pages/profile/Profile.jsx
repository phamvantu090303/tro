import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OpenModalForm } from "../../Store/filterModalForm";
import ModalUser from "../../component/User/ModalUser";
import { axiosInstance } from "../../../Axios";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalConFirm from "../../component/ModalConfirm";
import { openConfirmModal } from "../../Store/filterConfirmModal";
import ElectricityInvoice from "./test";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [chucnang, setChucnang] = useState("Thông tin cá nhân");
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [repairData, setRepairData] = useState({
    maphong: "",
    lydo: "",
  });
  const { isOpen } = useSelector((state) => state.ModalForm);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const menuItems = [
    { title: "Thông tin cá nhân", icon: "👤" },
    { title: "Sửa chữa", icon: "🔧" },
    { title: "Yêu cầu", icon: "📋" },
    { title: "Hóa đơn", icon: "💰" },
    { title: "Hợp đồng", icon: "📄" },
  ];

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/sua_chua/GetById");
      setData(res.data.suaChua);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmModal = (id) => {
    dispatch(openConfirmModal({ modalType: "Repair", id }));
  };

  const handleUpdateModal = (item) => {
    const id = item._id;
    setRepairData((prev) => ({
      ...prev,
      maphong: item.ma_phong,
      lydo: item.issue,
    }));
    dispatch(OpenModalForm({ modalType: "RepairEdit", id }));
  };
  useEffect(() => {
    console.log("isOpen", isOpen);
    if (!isOpen) {
      setRepairData((prev) => ({
        ...prev,
        maphong: "",
        lydo: "",
      }));
    }
  }, [isOpen]);
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-[100px] lg:px-[150px] mt-10 mb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center pb-6 border-b border-gray-200">
                <div className="relative">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button
                    className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-all duration-200"
                    onClick={() =>
                      dispatch(OpenModalForm({ modalType: "avatar" }))
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                  {user.username}
                </h3>
                <p className="text-gray-500 text-sm">
                  Ngày sinh: {formatDate(user.ngaysinh)}
                </p>
              </div>

              {/* Menu Items */}
              <nav className="mt-6 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => setChucnang(item.title)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      chucnang === item.title
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                {chucnang}
              </h2>

              {chucnang === "Thông tin cá nhân" && (
                <div className="space-y-6 w-full">
                  <div>
                    <h3 className="font-bold text-xl mb-6">
                      Thông tin cá nhân
                    </h3>
                    <div className="space-y-4 w-full">
                      <div className="flex gap-5 w-full">
                        <div className="w-full">
                          <p className="font-medium text-base">Tên tài khoản</p>
                          <input
                            type="text"
                            placeholder={user.username}
                            className="text-base px-5 py-4 placeholder:text-gray-500 font-medium  bg-slate-200 mt-3 w-full"
                          />
                        </div>
                        <div className="w-full">
                          <p className="font-medium text-base">Họ và Tên</p>
                          <input
                            type="text"
                            className=" text-base px-5 py-4 mt-3 w-full bg-slate-200 placeholder:text-gray-500 font-medium"
                            placeholder={user.hovaten}
                          />
                        </div>
                      </div>
                      <div className="flex gap-5 w-full">
                        <div className="w-full">
                          <p className="font-medium text-base">Quê quán</p>
                          <input
                            type="text"
                            placeholder={user.quequan}
                            className="text-base px-5 py-4 placeholder:text-gray-500 font-medium  bg-slate-200 mt-3 w-full"
                          />
                        </div>
                        <div className="w-full">
                          <p className="font-medium text-base">Ngày sinh</p>
                          <input
                            type="text"
                            className=" text-base px-5 py-4 mt-3 w-full bg-slate-200 placeholder:text-gray-500 font-medium"
                            placeholder={formatDate(user.ngaysinh)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-6">Bảo mật</h3>
                    <div className="space-y-4 w-full">
                      <div>
                        <p className="font-medium text-base">Email</p>
                        <input
                          type="text"
                          placeholder={user.email}
                          className="text-base px-5 py-4 placeholder:text-gray-500  text-gray-500 bg-slate-200 mt-3 w-full font-medium"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-base placeholder:text-gray-500  ">
                          Mật khẩu cũ
                        </p>
                        <input
                          type="password"
                          className=" text-base px-5 py-4 mt-3 w-full bg-slate-200 font-medium"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-base">Mật khẩu mới</p>
                        <input
                          type="password"
                          className=" text-base px-5 py-4 placeholder:text-gray-500  mt-3 w-full bg-slate-200 font-medium"
                          placeholder="Nhập mật khẩu mới"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      dispatch(OpenModalForm({ modalType: "profile" }))
                    }
                    className="w-full sm:w-auto px-6 py-3 bg-customBg text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                  >
                    Cập nhật thông tin
                  </button>
                </div>
              )}

              {chucnang === "Sửa chữa" && (
                <div>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-customBlue text-white ">
                        <tr>
                          <th className="px-6 py-3 text-center text-xl font-medium">
                            Ngày gửi
                          </th>
                          <th className="px-6 py-3 text-center text-xl font-medium">
                            Mô tả
                          </th>
                          <th className="px-6 py-3 text-center text-xl font-medium">
                            Trạng thái xử lý
                          </th>
                          <th className="px-6 py-3 text-center text-xl font-medium">
                            Xét duyệt
                          </th>
                          <th className="px-6 py-3 text-center text-xl font-medium">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white space-y-5">
                        {data.length > 0 ? (
                          data.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 text-lg text-gray-500 text-center">
                                {formatDate(item.createdAt)}
                              </td>
                              <td className="px-6 py-4 text-lg text-gray-500 text-center">
                                {item.issue}
                              </td>
                              <td className="px-6 py-4  text-center">
                                <span className="px-4 py-2 text-base font-medium rounded-full bg-red-500 text-white">
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-6 py-4  text-center">
                                <span className="px-4 py-2 text-base font-medium rounded-full bg-red-500 text-white">
                                  {item.approved}
                                </span>
                              </td>
                              <div className="flex gap-5 text-center px-10 py-4 items-center justify-center">
                                <FaEdit
                                  size={20}
                                  onClick={() => handleUpdateModal(item)}
                                />
                                <MdDelete
                                  size={20}
                                  color="red"
                                  onClick={() => handleConfirmModal(item._id)}
                                />
                              </div>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="text-xl sm:text-3xl font-bold text-center py-4"
                            >
                              Chưa có yêu cầu sửa chữa nào
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button
                    onClick={() =>
                      dispatch(OpenModalForm({ modalType: "Repair" }))
                    }
                    className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                  >
                    Gửi yêu cầu mới
                  </button>
                </div>
              )}

              {chucnang === "Hóa đơn" && (
                <div>
                  {/* <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-center text-xl font-medium">
                            Tháng
                          </th>
                          <th className="px-6 py-3 text-center text-xl font-medium">
                            Tổng tiền
                          </th>
                          <th className="px-6 py-3 text-center text-xl font-medium">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 text-lg text-gray-500">
                            02/2024
                          </td>
                          <td className="px-6 py-4 text-lg text-gray-500">
                            {formatCurrency(2500000)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Đã thanh toán
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium"></td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-lg text-gray-500">
                            03/2024
                          </td>
                          <td className="px-6 py-4 text-lg text-gray-500">
                            {formatCurrency(2700000)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              Chưa thanh toán
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <button
                              onClick={() =>
                                dispatch(
                                  OpenModalForm({ modalType: "payment" })
                                )
                              }
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Thanh toán
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div> */}
                  <ElectricityInvoice />
                </div>
              )}

              {chucnang === "Hợp đồng" && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Thông tin hợp đồng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoItem label="Ngày ký" value="01/01/2024" />
                      <InfoItem label="Ngày hết hạn" value="01/01/2025" />
                      <InfoItem
                        label="Giá thuê"
                        value={formatCurrency(2500000) + "/tháng"}
                      />
                      <div>
                        <span className="text-sm font-medium text-black">
                          Trạng thái
                        </span>
                        <span className="mt-1 block px-2 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 w-fit">
                          Đang hiệu lực
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        dispatch(OpenModalForm({ modalType: "contract" }))
                      }
                      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                    >
                      Yêu cầu hủy hợp đồng
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isOpen && <ModalUser reload={fetchData} repairData={repairData} />}
      <ModalConFirm reload={fetchData} />
    </div>
  );
}

const InfoItem = ({ label, value }) => (
  <div className="space-y-1">
    <span className="text-sm font-medium text-black">{label}</span>
    <p className="text-gray-800">{value}</p>
  </div>
);

export default Profile;
