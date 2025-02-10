import { FaUser, FaLock, FaAddressCard } from "react-icons/fa";
import wallperlogin from "../../assets/roomwallper.jpg";
import { useState } from "react";
import { IoIosCall } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { CgMail } from "react-icons/cg";
import { PiGenderIntersex } from "react-icons/pi";
import { Link } from "react-router";
function Register() {
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-zÀ-ỹà-ỹ\s]*$/.test(value)) {
      setName(value);
      setNameError("");
    } else {
      setNameError("Họ tên không hợp lệ (chỉ chứa chữ cái và dấu cách)");
    }
  };
  const handleFullNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-zÀ-ỹà-ỹ\s]*$/.test(value)) {
      setFullName(value);
      setNameError("");
    } else {
      setNameError("Họ tên không hợp lệ (chỉ chứa chữ cái và dấu cách)");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Email không hợp lệ");
    } else {
      setEmailError("");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhone(value);
      setPhoneError("");
    } else {
      setPhoneError("Số điện thoại chỉ được nhập số");
    }
  };

  const handleDateChange = (e) => {
    const inputDate = e.target.value;
    if (inputDate) {
      const [year, month, day] = inputDate.split("-");
      year <= date.now();
      setDate(`${day}/${month}/${year}`);
    } else {
      setDate("");
    }
  };
  return (
    <div className="relative flex">
      <div className="w-[45%] bg-gray-900 h-screen"></div>
      <div className="flex w-[55%]  items-center justify-center h-screen">
        <div className="absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] flex shadow-2xl rounded-2xl overflow-hidden h-[80%]">
          <div className="w-[50%] relative flex flex-col items-center justify-center text-white   ">
            <img
              src={wallperlogin}
              alt=""
              className="absolute inset-0 w-full h-full rounded-s-2xl  object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 h-full"></div>
            <div className="absolute inset-0 flex flex-col w-[100%]">
              <div className="absolute top-[30%] right-10 w-[80%]">
                <h1 className="text-[64px] text-right font-bold">Room</h1>
                <p className="mt-2 text-lg  text-right">
                  Choose your accommodation
                </p>
                <span className=" block h-[2px] bg-white w-full"></span>
              </div>

              <div className="absolute bottom-5 right-10 text-sm text-gray-300 text-end">
                <p className="font-semibold text-[34px] mb-5">calm & relaxed</p>
                <p>Contact: +62 891 7323 8801</p>
              </div>
            </div>
          </div>

          <div className="w-[50%] bg-slate-200 py-10 px-32 flex flex-col justify-center">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
              Đăng ký tài khoản
            </h2>
            <form className="space-y-8">
              <div className="grid grid-cols-2 gap-5">
                <div className="relative">
                  <FaUser className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Tên"
                    className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onChange={handleNameChange}
                    value={name}
                  />
                </div>
                <div className="relative">
                  <FaUser className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onChange={handleFullNameChange}
                    value={fullName}
                  />
                </div>
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-4 text-gray-400 text-lg" />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="relative">
                  <MdDateRange className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <input
                    type="date"
                    value={date.split("/").reverse().join("-")}
                    onChange={handleDateChange}
                    className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className="relative">
                  <PiGenderIntersex className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <select className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none bg-white">
                    <option value="" disabled selected>
                      Giới tính
                    </option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="relative">
                  <CgMail className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className="relative ">
                  <IoIosCall className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              </div>

              <div className="relative">
                <FaUser className="absolute left-3 top-4 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Quê quán"
                  className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div className="relative">
                <FaAddressCard className="absolute left-3 top-4 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Căn cước công dân"
                  className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div className="flex items-center">
                <input type="checkbox" className="mr-2 w-[20px] h-[20px]" />
                <label className="text-lg text-gray-600">
                  Remember Password
                </label>
              </div>
              <button className="w-full py-3 bg-gray-900 text-white rounded-lg text-lg font-semibold hover:bg-gray-700 transition">
                Register →
              </button>
            </form>
            <p className="mt-6 text-lg text-center text-gray-500 flex justify-center gap-5">
              You already have an account{" "}
              <Link to="/Login">
                <p className="text-gray-700 font-semibold">Login</p>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
