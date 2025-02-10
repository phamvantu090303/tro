import { useSelector } from "react-redux";
import logo from "../assets/logo/logo.svg";
import { CiHeart } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";

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
  },
];

function Header() {
  const { user } = useSelector((state) => state.auth);
  return (
    <nav className="w-full bg-[#1c203d] text-white py-5">
      <div className="max-w-[1920px] mx-auto px-[150px] flex items-center justify-between">
        <div className="flex items-center">
          <img src={logo} className="h-10" />
        </div>
        <div className="flex gap-12">
          <ul className="flex space-x-6 text-sm uppercase list-none justify-between ">
            {Item.map((item) => (
              <li
                key={item.id}
                className="cursor-pointer hover:text-gray-300 hover:bg-white/10 text-white px-3 py-3 font-medium text-base "
              >
                {item.name}
              </li>
            ))}
          </ul>
          <div className="flex space-x-4">
            {!user ? (
              <>
                <button className="font-bold text-base border border-white px-9 py-3 rounded-md hover:bg-white hover:text-black transition">
                  Register
                </button>
                <button className="font-bold text-base bg-white text-black px-9 py-3 rounded-md hover:bg-gray-300 transition">
                  Sign In
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <CiHeart className="w-[30px] h-[30px]" />
                <div className="flex items-center gap-5">
                  <FaRegUser className="w-[25px] h-[25px]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
