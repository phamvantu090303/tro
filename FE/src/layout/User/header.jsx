import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/logo/logo.svg";
import { CiHeart } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { logout } from "../../Store/filterUser";
const Item = [
  {
    id: 1,
    name: "Trang chủ",
    Navigate: "/",
  },
  {
    id: 2,
    name: "Bảo mật",
  },
  {
    id: 3,
    name: "Phòng trọ",
  },
  {
    id: 4,
    name: "Tìm kiếm",
    Navigate: "/Search",
  },
];

function Header() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const handleLogout = async () => {
    dispatch(logout());
  };

  return (
    <nav className="w-full bg-[#1c203d] text-white py-5">
      <div className="max-w-[1920px] mx-auto px-6 md:px-[150px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} className="min-h-7 min-w-7" />
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <AiOutlineClose className="w-8 h-8" />
            ) : (
              <AiOutlineMenu className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-[#1c203d] md:flex md:gap-12 items-center transition-all ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col md:flex-row  md:space-y-0 md:space-x-6 text-sm uppercase list-none">
            {Item.map((item) => (
              <li
                key={item.id}
                className="cursor-pointer hover:text-gray-300 hover:bg-white/10 text-white px-5 py-3 font-medium text-sm xl:text-base md:px-3"
                onClick={() => {
                  navigate(item.Navigate);
                  setIsOpen(false); // Đóng menu sau khi chọn
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>

          {/* User Actions */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 mt-5 md:mt-0 px-6 md:px-0">
            {!user ? (
              <>
                <button
                  className="font-bold text-base border border-white px-6 py-3 rounded-md hover:bg-white hover:text-black transition"
                  onClick={() => navigate("/Register")}
                >
                  Register
                </button>
                <button
                  className="font-bold text-base bg-white text-black px-6 py-3 rounded-md hover:bg-gray-300 transition"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
              </>
            ) : (
              <div className="flex items-center gap-5">
                <CiHeart
                  className="w-[30px] h-[30px] cursor-pointer"
                  onClick={() => navigate("/yeuthich")}
                />
                <FaRegUser
                  className="w-[25px] h-[25px] cursor-pointer relative"
                  onClick={() => setModal(!modal)}
                />
                {modal && (
                  <ul className="bg-customBlue absolute right-20 top-16 rounded-lg w-[150px] h-[100px]">
                    <li
                      onClick={() => navigate("/profile")}
                      className="text-white cursor-pointer py-3 px-5 rounded-t-lg text-base hover:bg-blue-900"
                    >
                      Trang cá nhân
                    </li>
                    <li
                      onClick={handleLogout}
                      className="text-white cursor-pointer py-3 px-5 text-base hover:bg-blue-900"
                    >
                      Đăng xuất
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
