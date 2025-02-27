import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";

export default function AdminSidebar({ setActiveComponent }) {
  const { admin } = useSelector((state) => state.authAdmin);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (component) => location.pathname.includes(component);

  return (
    <aside className="h-screen flex flex-col justify-between w-1/6 bg-gray-800 text-gray-300 border-r">
      <div>
        <div className="flex gap-5 items-center mb-8">
          <img
            loading="lazy"
            src="/images/VA.svg"
            alt="Logo"
            className="w-[60px] h-[60px] object-contain"
          />
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>
        <nav className="flex flex-col justify-between">
          <ul className="flex flex-col gap-4">
            <li
              className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 ${
                isActive("admin") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveComponent("admin")}
            >
              <MdOutlineAdminPanelSettings className="text-xl" />
              Acc Admin
            </li>
            <li
              className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 ${
                isActive("phongtro") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveComponent("phongtro")}
            >
              <MdOutlineAdminPanelSettings className="text-xl" />
              Quản lý phòng
            </li>
            <li
              className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 ${
                isActive("danhmuc") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveComponent("danhmuc")}
            >
              <MdOutlineAdminPanelSettings className="text-xl" />
              Quản lý Danh Mục
            </li>
            <li
              className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 ${
                isActive("thietbi") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveComponent("thietbi")}
            >
              <MdOutlineAdminPanelSettings className="text-xl" />
              Quản lý Thiết Bị
            </li>
            <li
              className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 ${
                isActive("anhphong") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveComponent("anhphong")}
            >
              <MdOutlineAdminPanelSettings className="text-xl" />
              Quản lý Ảnh Phòng
            </li>
            <li
              className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 ${
                isActive("yeuthich") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveComponent("yeuthich")}
            >
              <MdOutlineAdminPanelSettings className="text-xl" />
              Quản lý Yêu Thích
            </li>
            <li
              className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 ${
                isActive("adminuser") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveComponent("adminuser")}
            >
              <MdOutlineAdminPanelSettings className="text-xl" />
              Quản lý User
            </li>
            <li
              className={`font-medium cursor-pointer p-3 rounded flex items-center gap-3 ${
                isActive("mess") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveComponent("mess")}
            >
              <MdOutlineAdminPanelSettings className="text-xl" />
              Mess
            </li>
          </ul>
        </nav>
      </div>
      <div className="p-3 flex justify-between">
        <div className="flex items-center gap-3">
          <img
            loading="lazy"
            src={admin?.cover_photo || "./images/iconavatar.jpg"}
            alt="Avatar"
            className="object-contain shrink-0 aspect-square rounded-full w-[30px] h-[30px]"
          />
          <div className="flex flex-col">
            {admin?.username && (
              <div className="font-medium tracking-tight text-slate-500">
                {admin?.username}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="text-xl bg-gray-700 p-2 rounded"
        >
          <IoIosLogOut className="text-xl" />
        </button>
      </div>
    </aside>
  );
}
