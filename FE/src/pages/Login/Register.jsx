import { FaUser, FaLock, FaAddressCard } from "react-icons/fa";
import wallperlogin from "../../assets/roomwallper.jpg";
import { useState } from "react";
import { IoIosCall } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { CgMail } from "react-icons/cg";
import { PiGenderIntersex } from "react-icons/pi";
import { Link } from "react-router";
import { FaMapLocationDot } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
function Register() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
    hovaten: "",
    ngaysinh: "",
    quequan: "",
    sodienthoai: "",
    gioitinh: 0,
    cccd: "",
  });

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    let errorMsg = "";

    if (value.trim() !== "") {
      if (name === "hovaten" || name === "quequan") {
        if (!/^[A-Za-zÀ-ỹà-ỹ\s]+$/.test(value)) {
          errorMsg = "Chỉ được nhập chữ cái và khoảng trắng.";
        }
      }

      if (name === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMsg = "Email không hợp lệ.";
        }
      }

      if (name === "password") {
        if (value.length < 6) {
          errorMsg = "Mật khẩu phải có ít nhất 6 ký tự.";
        }
      }

      if (name === "sodienthoai") {
        if (!/^\d{10}$/.test(value)) {
          errorMsg = "Số điện thoại phải có 10 chữ số.";
        }
      }

      if (name === "cccd") {
        if (!/^\d{10}$/.test(value)) {
          errorMsg = "Căn cước công dân phải có 12 chữ số.";
        }
      }
      if (name === "ngaysinh") {
        const selectedDate = new Date(value);
        if (isNaN(selectedDate.getTime()) || selectedDate > new Date()) {
          errorMsg = "Ngày sinh không hợp lệ.";
        }
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    validate(name, value);
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let newErrors = {};

    Object.keys(user).forEach((key) => {
      if (!user[key]) newErrors[key] = "Trường này không được bỏ trống.";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log("Errors found:", newErrors);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        email: user.email,
        password: user.password,
        username: user.username,
        ho_va_ten: user.hovaten,
        ngay_sinh: new Date(user.ngaysinh).toISOString(),
        que_quan: user.quequan,
        so_dien_thoai: user.sodienthoai,
        gioi_tinh: user.gioitinh,
        cccd: user.cccd,
      });
      console.log("Server response:", res.data);
      if (res.data.message) {
        toast.success(
          res.data.message,
          "Hãy kiểm tra Email để xác thực tài khoản"
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="relative flex">
      <div className="w-[45%] bg-gray-900 h-screen"></div>
      <div className="flex w-[55%]  items-center justify-center h-screen">
        <div className="absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full lg:w-[80%] lg:flex shadow-2xl lg:rounded-2xl overflow-hidden h-full lg:h-[85%]">
          <div className="w-[50%] relative lg:flex lg:flex-col lg:items-center lg:justify-center text-white  hidden   ">
            <img
              src={wallperlogin}
              alt=""
              className="absolute inset-0 w-full h-full rounded-s-2xl  object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 h-full"></div>
            <div className="absolute inset-0 flex flex-col w-[100%]">
              <div className="absolute top-[30%] right-10 w-[80%]">
                <h1 className="text-[64px] text-right font-bold">Phòng trọ</h1>
                <p className="mt-2 text-lg  text-right">Chọn chỗ ở của bạn</p>
                <span className=" block h-[2px] bg-white w-full"></span>
              </div>

              <div className="absolute bottom-5 right-10 xl:text-sm text-xs text-gray-300 text-end">
                <p className="font-semibold text-[34px] mb-5">
                  Bình tĩnh và thư giãn
                </p>
                <p>Liên hệ: +62 891 7323 8801</p>
              </div>
            </div>
          </div>
          <div className="lg:w-[50%] w-full h-full bg-slate-200 py-3 px-5 md:px-10  2xl:py-10 2xl:px-32 flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl 2xl:text-3xl font-semibold text-gray-800 text-center mb-8">
              Đăng ký tài khoản
            </h2>
            <form className="space-y-3 2xl:space-y-8" onSubmit={handleRegister}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <FaUser className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Tên"
                    name="username"
                    className="w-full  px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onChange={handleChange}
                    value={user.username}
                  />
                  <div className="xl:h-2">
                    {errors.username && (
                      <p className="text-red-500 xl:text-sm text-xs xl:mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <FaUser className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <input
                    type="text"
                    name="hovaten"
                    placeholder="Họ và tên"
                    className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onChange={handleChange}
                    value={user.hovaten}
                  />
                  <div className="xl:h-2">
                    {errors.hovaten && (
                      <p className="text-red-500 xl:text-sm text-xs xl:mt-1">
                        {errors.hovaten}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-4 text-gray-400 text-lg" />
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={user.password}
                  className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onChange={handleChange}
                />
                <div className="xl:h-2">
                  {errors.password && (
                    <p className="text-red-500 xl:text-sm text-xs xl:mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <MdDateRange className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <input
                    type="date"
                    name="ngaysinh"
                    value={user.ngaysinh}
                    onChange={handleChange}
                    className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <div className="xl:h-2">
                    {errors.ngaysinh && (
                      <p className="text-red-500 xl:text-sm text-xs xl:mt-1">
                        {errors.ngaysinh}
                      </p>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <PiGenderIntersex className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <select
                    name="gioitinh"
                    value={user.gioitinh}
                    onChange={handleChange}
                    className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none bg-white"
                  >
                    <option value="" disabled>
                      Giới tính
                    </option>
                    <option value="1">Nam</option>
                    <option value="0">Nữ</option>
                  </select>
                  <div className="xl:h-2">
                    {errors.gioitinh && (
                      <p className="text-red-500 xl:text-sm text-xs xl:mt-1">
                        {errors.gioitinh}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <CgMail className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Email"
                    value={user.email}
                    name="email"
                    onChange={handleChange}
                    className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <div className="xl:h-2">
                    {errors.email && (
                      <p className="text-red-500 xl:text-sm text-xs xl:mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <IoIosCall className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    name="sodienthoai"
                    value={user.sodienthoai}
                    onChange={handleChange}
                    className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <div className="xl:h-2">
                    {errors.sodienthoai && (
                      <p className="text-red-500 xl:text-sm text-xs xl:mt-1">
                        {errors.sodienthoai}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <FaMapLocationDot className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Quê quán"
                    name="quequan"
                    className="w-full  px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onChange={handleChange}
                    value={user.quequan}
                  />
                  <div className="xl:h-2">
                    {errors.quequan && (
                      <p className="text-red-500 xl:text-sm text-xs xl:mt-1">
                        {errors.quequan}
                      </p>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <FaUser className="absolute left-3 top-4 text-gray-400 text-lg" />
                  <input
                    type="text"
                    name="cccd"
                    placeholder="Căn cước công dân"
                    className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onChange={handleChange}
                    value={user.cccd}
                  />
                  <div className="xl:h-2">
                    {errors.cccd && (
                      <p className="text-red-500 xl:text-sm text-xs xl:mt-1">
                        {errors.cccd}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 2xl:w-[20px] 2xl:h-[20px] h-[15px] w-[15px]"
                />
                <label className="2xl:text-lg text-base text-gray-600">
                  Lưu mật khẩu
                </label>
              </div>

              <button
                type="submit"
                className="w-full 2xl:py-3 xl:py-2 bg-gray-900 text-white rounded-lg 2xl:text-lg font-semibold hover:bg-gray-700 transition"
              >
                Đăng ký →
              </button>
            </form>

            <p className="2xl:mt-6 mt-3 2xl:text-lg text-base text-center text-gray-500 flex justify-center gap-5">
              Bạn đã có tài khoản{" "}
              <Link to="/Login" className="text-gray-700 font-semibold">
                Đăng nhập tại đây
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
