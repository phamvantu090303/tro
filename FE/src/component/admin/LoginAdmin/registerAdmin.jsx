import { FaUser, FaLock, FaAddressCard } from "react-icons/fa";
import { useState } from "react";
import { IoIosCall } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { CgMail } from "react-icons/cg";
import { PiGenderIntersex } from "react-icons/pi";
import { useNavigate } from "react-router";
import { axiosInstance } from "../../../../Axios";
import { toast } from "react-toastify";

function RegisterAdmin() {
  const [hoVaTen, setHoVaTen] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");  // Thêm trường username
  const [ngaySinh, setNgaySinh] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [cccd, setCccd] = useState("");
  const [gioiTinh, setGioiTinh] = useState("Nam");
  const [queQuan, setQueQuan] = useState("");  // Thêm trường quê quán

  const [hoVaTenError, setHoVaTenError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [soDienThoaiError, setSoDienThoaiError] = useState("");
  const [cccdError, setCccdError] = useState("");
  const [usernameError, setUsernameError] = useState(""); // Thêm lỗi cho username
  const [queQuanError, setQueQuanError] = useState(""); // Thêm lỗi cho quê quán

  const navigate = useNavigate();

  const handleHoVaTenChange = (e) => {
    const value = e.target.value;
    setHoVaTen(value);
    if (!/^[A-Za-zÀ-ỹà-ỹ\s]*$/.test(value)) {
      setHoVaTenError("Họ tên không hợp lệ");
    } else {
      setHoVaTenError("");
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

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value.length < 3) {
      setUsernameError("Username phải có ít nhất 3 ký tự");
    } else {
      setUsernameError("");
    }
  };

  const handleSoDienThoaiChange = (e) => {
    const value = e.target.value;
    setSoDienThoai(value);
    if (!/^\d*$/.test(value)) {
      setSoDienThoaiError("Số điện thoại chỉ được nhập số");
    } else {
      setSoDienThoaiError("");
    }
  };

  const handleCccdChange = (e) => {
    const value = e.target.value;
    setCccd(value);
    if (!/^\d{9,12}$/.test(value)) {
      setCccdError("Căn cước công dân không hợp lệ");
    } else {
      setCccdError("");
    }
  };

  const handleQueQuanChange = (e) => {
    const value = e.target.value;
    setQueQuan(value);
    if (value.trim() === "") {
      setQueQuanError("Quê quán không được để trống");
    } else {
      setQueQuanError("");
    }
  };

  const handleNgaySinhChange = (e) => {
    setNgaySinh(e.target.value);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (
      hoVaTenError ||
      emailError ||
      soDienThoaiError ||
      cccdError ||
      usernameError ||
      queQuanError
    ) {
      toast.error("Vui lòng sửa các lỗi trước khi đăng ký.");
      return;
    }

    try {
      const res = await axiosInstance.post("/admin/create", {
        id_quyen: "67b1a1141a0b897ea193e857",
        email,
        password,
        username,
        ho_va_ten: hoVaTen,
        ngay_sinh: ngaySinh,
        que_quan: queQuan,
        so_dien_thoai: soDienThoai,
        gioi_tinh: gioiTinh,
        cccd,
      });
      console.log("/admin/create: ", res.data);
      navigate("/");
      toast.success("Đăng ký thành công!");
    } catch (error) {
      console.log(error);
      toast.error("Đăng ký không thành công, vui lòng thử lại.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[400px] bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng ký tài khoản Admin</h2>
        <form className="space-y-4">
          {/* Trường Họ và tên */}
          <div>
            <FaUser className="absolute left-3 top-2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Họ và tên"
              value={hoVaTen}
              onChange={handleHoVaTenChange}
              className="w-full px-10 py-3 border border-gray-300 rounded-lg"
            />
            {hoVaTenError && <p className="text-red-500 text-sm">{hoVaTenError}</p>}
          </div>

          {/* Trường Username */}
          <div>
            <FaUser className="absolute left-3 top-2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              className="w-full px-10 py-3 border border-gray-300 rounded-lg"
            />
            {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
          </div>

          {/* Trường Email */}
          <div>
            <CgMail className="absolute left-3 top-2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-10 py-3 border border-gray-300 rounded-lg"
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>

          {/* Trường Mật khẩu */}
          <div>
            <FaLock className="absolute left-3 top-2 text-gray-400 text-lg" />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-10 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Trường Ngày sinh */}
          <div>
            <MdDateRange className="absolute left-3 top-2 text-gray-400 text-lg" />
            <input
              type="date"
              value={ngaySinh}
              onChange={handleNgaySinhChange}
              className="w-full px-10 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Trường Quê quán */}
          <div>
            <input
              type="text"
              placeholder="Quê quán"
              value={queQuan}
              onChange={handleQueQuanChange}
              className="w-full px-10 py-3 border border-gray-300 rounded-lg"
            />
            {queQuanError && <p className="text-red-500 text-sm">{queQuanError}</p>}
          </div>

          {/* Trường Giới tính */}
          <div>
            <PiGenderIntersex className="absolute left-3 top-2 text-gray-400 text-lg" />
            <select
              value={gioiTinh}
              onChange={(e) => setGioiTinh(e.target.value)}
              className="w-full px-10 py-3 border border-gray-300 rounded-lg"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          {/* Trường Số điện thoại */}
          <div>
            <IoIosCall className="absolute left-3 top-2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={soDienThoai}
              onChange={handleSoDienThoaiChange}
              className="w-full px-10 py-3 border border-gray-300 rounded-lg"
            />
            {soDienThoaiError && <p className="text-red-500 text-sm">{soDienThoaiError}</p>}
          </div>

          {/* Trường Căn cước công dân */}
          <div>
            <FaAddressCard className="absolute left-3 top-2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Căn cước công dân"
              value={cccd}
              onChange={handleCccdChange}
              className="w-full px-10 py-3 border border-gray-300 rounded-lg"
            />
            {cccdError && <p className="text-red-500 text-sm">{cccdError}</p>}
          </div>

          <div>
            <button
              onClick={handleRegister}
              className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterAdmin;
