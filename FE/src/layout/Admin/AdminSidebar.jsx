import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useState } from "react";
import logo from "../../assets/logo/Logo.svg";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { FaMap } from "react-icons/fa";
import { FaBars } from "react-icons/fa"; // Icon hamburger
import { IoChevronDown, IoChevronUp } from "react-icons/io5"; // Icon mũi tên

export default function AdminSidebar({ setActiveComponent, activeComponent }) {
  const { admin } = useSelector((state) => state.authAdmin);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Trạng thái toggle sidebar trên mobile
  const [dropdowns, setDropdowns] = useState({
    thongke: false,
    quanly: false,
  });

  const isActive = (component) => activeComponent === component;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        <FaBars className="text-xl" />
      </button>

      <aside
        className={`fixed inset-y-0 left-0 min-w-56 bg-customBg text-white border-r shadow-lg transform transition-transform duration-300 ease-in-out z-40
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
            <nav className="flex flex-col overflow-y-auto 2xl:mt-10">
              <ul className="flex flex-col gap-2 px-2">
                <li
                  className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 transition-all duration-300 transform ${
                    isActive("admin")
                      ? "bg-blue-900 text-white scale-105"
                      : "text-gray-300 hover:bg-blue-950 hover:text-white hover:scale-102"
                  }`}
                  onClick={() => {
                    setActiveComponent("admin");
                    setIsOpen(false);
                  }}
                >
                  <MdOutlineAdminPanelSettings className="2xl:text-xl text-sm transition-transform duration-300 hover:rotate-12" />
                  Acc Admin
                </li>

                {/* Quản Lý Dropdown */}
                <li>
                  <div
                    className={`font-medium cursor-pointer p-3 rounded flex items-center justify-between transition-all duration-300 transform ${
                      dropdowns.quanly
                        ? "bg-blue-900 text-white scale-105"
                        : "text-gray-300 hover:bg-blue-950  hover:scale-102"
                    }`}
                    onClick={() => toggleDropdown("quanly")}
                  >
                    <div className="flex items-center gap-3">
                      <MdOutlineAdminPanelSettings className="2xl:text-xl text-sm transition-transform duration-300 hover:rotate-12" />
                      Quản Lý
                    </div>
                    {dropdowns.quanly ? <IoChevronUp /> : <IoChevronDown />}
                  </div>
                  {dropdowns.quanly && (
                    <ul className="ml-6 flex flex-col gap-2 mt-2">
                      <li
                        className={`font-medium cursor-pointer p-2 rounded flex items-center gap-3 transition-all duration-300 ${
                          isActive("phongtro")
                            ? "bg-blue-900 text-white scale-105"
                            : "text-gray-300 hover:bg-blue-950  hover:scale-102"
                        }`}
                        onClick={() => {
                          setActiveComponent("phongtro");
                          setIsOpen(false);
                        }}
                      >
                        Quản lý phòng
                      </li>
                      <li
                        className={`font-medium cursor-pointer p-2 rounded flex items-center gap-3 transition-all duration-300 ${
                          isActive("danhmuc")
                            ? "bg-blue-900 text-white scale-105"
                            : "text-gray-300 hover:bg-blue-950  hover:scale-102"
                        }`}
                        onClick={() => {
                          setActiveComponent("danhmuc");
                          setIsOpen(false);
                        }}
                      >
                        Quản lý Danh Mục
                      </li>
                      <li
                        className={`font-medium cursor-pointer p-2 rounded flex items-center gap-3 transition-all duration-300 ${
                          isActive("thietbi")
                            ? "bg-blue-900 text-white scale-105"
                            : "text-gray-300 hover:bg-blue-950  hover:scale-102"
                        }`}
                        onClick={() => {
                          setActiveComponent("thietbi");
                          setIsOpen(false);
                        }}
                      >
                        Quản lý Thiết Bị
                      </li>
                      <li
                        className={`font-medium cursor-pointer p-2 rounded flex items-center gap-3 transition-all duration-300 ${
                          isActive("anhphong")
                            ? "bg-blue-900 text-white scale-105"
                            : "text-gray-300 hover:bg-blue-950  hover:scale-102"
                        }`}
                        onClick={() => {
                          setActiveComponent("anhphong");
                          setIsOpen(false);
                        }}
                      >
                        Quản lý Ảnh Phòng
                      </li>
                      <li
                        className={`font-medium cursor-pointer p-2 rounded flex items-center gap-3 transition-all duration-300 ${
                          isActive("yeuthich")
                            ? "bg-blue-900 text-white scale-105"
                            : "text-gray-300 hover:bg-blue-950  hover:scale-102"
                        }`}
                        onClick={() => {
                          setActiveComponent("yeuthich");
                          setIsOpen(false);
                        }}
                      >
                        Quản lý Yêu Thích
                      </li>
                      <li
                        className={`font-medium cursor-pointer p-2 rounded flex items-center gap-3 transition-all duration-300 ${
                          isActive("adminuser")
                            ? "bg-blue-900 text-white scale-105"
                            : "text-gray-300 hover:bg-blue-950  hover:scale-102"
                        }`}
                        onClick={() => {
                          setActiveComponent("adminuser");
                          setIsOpen(false);
                        }}
                      >
                        Quản lý User
                      </li>
                    </ul>
                  )}
                </li>

                <li
                  className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 transition-all duration-300 transform ${
                    isActive("mess")
                      ? "bg-blue-900 text-white scale-105"
                      : "text-gray-300 hover:bg-blue-950 hover:text-white hover:scale-102"
                  }`}
                  onClick={() => {
                    setActiveComponent("mess");
                    setIsOpen(false);
                  }}
                >
                  <MdOutlineAdminPanelSettings className="2xl:text-xl text-sm transition-transform duration-300 hover:rotate-12" />
                  Mess
                </li>

                <li
                  className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 transition-all duration-300 transform ${
                    isActive("map")
                      ? "bg-blue-900 text-white scale-105"
                      : "text-gray-300 hover:bg-blue-950 hover:text-white hover:scale-102"
                  }`}
                  onClick={() => {
                    setActiveComponent("map");
                    setIsOpen(false);
                  }}
                >
                  <FaMap className="2xl:text-xl text-sm transition-transform duration-300 hover:rotate-12" />
                  Map
                </li>

                {/* Thống Kê Dropdown */}
                <li>
                  <div
                    className={`font-medium cursor-pointer p-3 rounded flex items-center justify-between transition-all duration-300 transform ${
                      dropdowns.thongke
                        ? "bg-blue-900 text-white scale-105"
                        : "text-gray-300 hover:bg-blue-950  hover:scale-102"
                    }`}
                    onClick={() => toggleDropdown("thongke")}
                  >
                    <div className="flex items-center gap-3">
                      <MdOutlineAdminPanelSettings className="2xl:text-xl text-sm transition-transform duration-300 hover:rotate-12" />
                      Thống Kê
                    </div>
                    {dropdowns.thongke ? <IoChevronUp /> : <IoChevronDown />}
                  </div>
                  {dropdowns.thongke && (
                    <ul className="ml-6 flex flex-col gap-2 mt-2">
                      <li
                        className={`font-medium cursor-pointer p-2 rounded flex items-center gap-3 transition-all duration-300 ${
                          isActive("thongke")
                            ? "bg-blue-900 text-white scale-105"
                            : "text-gray-300 hover:bg-blue-950  hover:scale-102"
                        }`}
                        onClick={() => {
                          setActiveComponent("thongkeDanhgia");
                          setIsOpen(false);
                        }}
                      >
                        Thống kê đánh giá
                      </li>
                      <li
                        className={`font-medium cursor-pointer p-2 rounded flex items-center gap-3 transition-all duration-300 ${
                          isActive("thongke_dien")
                            ? "bg-blue-900 text-white scale-105"
                            : "text-gray-300 hover:bg-blue-950  hover:scale-102"
                        }`}
                        onClick={() => {
                          setActiveComponent("thongkeYeuthich");
                          setIsOpen(false);
                        }}
                      >
                        Thống kê yêu thích
                      </li>
                      <li
                        className={`font-medium cursor-pointer p-2 rounded flex items-center gap-3 transition-all duration-300 ${
                          isActive("thongke_dien")
                            ? "bg-blue-900 text-white scale-105"
                            : "text-gray-300 hover:bg-blue-950  hover:scale-102"
                        }`}
                        onClick={() => {
                          setActiveComponent("thongkeDien");
                          setIsOpen(false);
                        }}
                      >
                        Thống kê Điện tiêu thụ
                      </li>
                    </ul>
                  )}
                </li>
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
              onClick={() => navigate("/admin/login")}
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
