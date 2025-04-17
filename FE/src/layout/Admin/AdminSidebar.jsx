import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useState } from "react";
import logo from "../../assets/logo/Logo.svg";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { FaMap } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { logoutAdmin } from "../../Store/filterAdmin";

export default function AdminSidebar({ setActiveComponent, activeComponent }) {
  const { admin } = useSelector((state) => state.authAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({});

  const isActive = (component) => activeComponent === component;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate("/admin/login");
  };

  // Danh sách items menu
  const menuItems = [
    {
      key: "quyen",
      label: "Phân quyền",
      icon: (
        <MdOutlineAdminPanelSettings className="2xl:text-xl text-sm transition-transform duration-300 hover:rotate-12" />
      ),
    },
    {
      key: "admin",
      label: "Acc Admin",
      icon: (
        <MdOutlineAdminPanelSettings className="2xl:text-xl text-sm transition-transform duration-300 hover:rotate-12" />
      ),
    },
    {
      key: "quanly",
      label: "Quản Lý",
      icon: (
        <MdOutlineAdminPanelSettings className="2xl:text-xl text-sm transition-transform duration-300 hover:rotate-12" />
      ),
      children: [
        { key: "phongtro", label: "Quản lý phòng" },
        { key: "danhmuc", label: "Quản lý Danh Mục" },
        { key: "dichvu", label: "Quản lý dịch vụ" },
        { key: "hoadoncoc", label: "Quản lý hóa đơn cọc" },
        { key: "suachua", label: "Quản lý sửa chữa" },
        { key: "hoadonthang", label: "Quản lý hóa đơn tháng" },
        { key: "thietbi", label: "Quản lý Thiết Bị" },
        { key: "anhphong", label: "Quản lý Ảnh Phòng" },
        { key: "yeuthich", label: "Quản lý Yêu Thích" },
        { key: "adminuser", label: "Quản lý User" },
      ],
    },
    {
      key: "mess",
      label: "Nhắn tin",
      icon: (
        <MdOutlineAdminPanelSettings className="2xl:text-xl text-sm transition-transform duration-300 hover:rotate-12" />
      ),
    },
    {
      key: "map",
      label: "Bản đồ",
      icon: (
        <FaMap className="2xl:text-xl text-sm transition-transform duration-300 hover:rotate-12" />
      ),
    },
    {
      key: "thongke",
      label: "Thống Kê",
      icon: (
        <MdOutlineAdminPanelSettings className="2xl:text-xl text-sm transition-transform duration-300 hover:rotate-12" />
      ),
      children: [
        { key: "thongkeDanhgia", label: "Thống kê đánh giá" },
        { key: "thongkeYeuthich", label: "Thống kê yêu thích" },
        { key: "thongkeDien", label: "Thống kê Điện tiêu thụ" },
      ],
    },
  ];

  return (
    <>
      <button
        className="md:hidden fixed top-0 left-0 z-10 text-white bg-gray-800 p-2 "
        onClick={toggleSidebar}
      >
        <FaBars className="text-xl" />
      </button>

      <aside
        className={`fixed inset-y-0 left-0 min-w-56 h-screen bg-customBg text-white border-r shadow-lg transform transition-transform duration-300 ease-in-out z-40 overflow-auto
    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    md:relative md:w-1/6 md:translate-x-0`}
      >
        <div className="flex flex-col h-full justify-between">
          {/* Logo */}
          <div>
            <div className="flex items-center justify-between">
              <img
                src={logo}
                alt="Logo"
                className="object-contain py-3 px-5 hidden md:block"
              />
              <button
                className="md:hidden text-white p-2"
                onClick={toggleSidebar}
              >
                <IoIosLogOut className="text-xl" />
              </button>
            </div>

            {/* Menu */}
            <nav className="flex flex-col  2xl:mt-10">
              <ul className="flex flex-col gap-2 px-2">
                {menuItems.map((item) => (
                  <li key={item.key}>
                    <div
                      className={`font-medium cursor-pointer p-3 rounded flex items-center justify-between transition-all duration-300 transform ${
                        isActive(item.key) || dropdowns[item.key]
                          ? "bg-blue-900 text-white scale-105"
                          : "text-gray-300 hover:bg-blue-950 hover:text-white hover:scale-102"
                      }`}
                      onClick={() =>
                        item.children
                          ? toggleDropdown(item.key)
                          : (setActiveComponent(item.key), setIsOpen(false))
                      }
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        {item.label}
                      </div>
                      {item.children &&
                        (dropdowns[item.key] ? (
                          <IoChevronUp />
                        ) : (
                          <IoChevronDown />
                        ))}
                    </div>
                    {item.children && dropdowns[item.key] && (
                      <ul className="ml-6 flex flex-col gap-2 mt-2">
                        {item.children.map((child) => (
                          <li
                            key={child.key}
                            className={`font-medium cursor-pointer p-2 rounded flex items-center gap-3 transition-all duration-300 ${
                              isActive(child.key)
                                ? "bg-blue-900 text-white scale-105"
                                : "text-gray-300 hover:bg-blue-950 hover:scale-102"
                            }`}
                            onClick={() => {
                              setActiveComponent(child.key);
                              setIsOpen(false);
                            }}
                          >
                            {child.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-3 flex justify-between items-center border-t border-gray-700">
            <div className="flex items-center gap-3 transition-all duration-300 hover:bg-gray-700 p-2 rounded">
              <img
                loading="lazy"
                src={admin?.cover_photo || "./images/iconavatar.jpg"}
                alt="Avatar"
                className="object-contain shrink-0 aspect-square rounded-full w-[30px] h-[30px] transition-transform duration-300 hover:scale-110"
              />
              <div className="flex flex-col">
                {admin?.username && (
                  <div className="font-medium tracking-tight text-slate-500 transition-colors duration-300 hover:text-white">
                    {admin?.username}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-xl bg-gray-700 p-2 rounded transition-all duration-300 hover:bg-red-600 hover:scale-110"
            >
              <IoIosLogOut className="text-xl" />
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
