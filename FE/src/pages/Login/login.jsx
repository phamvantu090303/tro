import { FaUser, FaLock } from "react-icons/fa";
import wallperlogin from "../../assets/roomwallper.jpg";
import { useState } from "react";
import { axiosInstance } from "../../../Axios";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../Store/filterUser";
import { toast } from "react-toastify";

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispath = useDispatch();
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/login", {
        email: email,
        password: password,
      });
      console.log("res,", res.data.data.user);
      dispath(
        login({
          user: res.data.data.user,
          token: res.data.data.token,
        })
      );
      navigate("/");
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      setError(error.response?.data?.message);
    }
  };

  const handleSuccess = async (response) => {
    const { credential } = response; // Nhận ID Token từ Google
    console.log('credential: ', credential);

    try {
      const res = await axiosInstance.post("/auth/login-google", {
        token: credential,
      });
      const { user, token } = res.data.data;
      console.log("Google login response:", res.data.data);

      dispath(
        login({
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
          token: token,
        })
      );

      navigate("/");
      toast.success("Đăng nhập Google thành công!");
    } catch (error) {
      console.error("Google login failed:", error);
      setError(error.response?.data?.message || "Đăng nhập Google thất bại!");
    }
  };

const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name == "email") setEmail(value);
  if (name == "password") setPassword(value);
};
return (
  <div className="relative flex">
    <div className="w-[45%] bg-gray-900 h-screen"></div>
    <div className="flex w-[55%]  items-center justify-center h-screen">
      <div className="absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full lg:w-[80%] lg:flex shadow-2xl lg:rounded-2xl overflow-hidden h-full lg:h-[85%]">
        <div className="w-[50%] relative lg:flex lg:flex-col lg:items-center lg:justify-center text-white  hidden ">
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

        <div className="lg:w-[50%] w-full h-full bg-slate-200 py-5 px-16 lg:py-10 lg:px-32 flex flex-col justify-center">
          <h2 className="text-xl lg:text-3xl  font-semibold text-gray-800 text-center mb-8">
            Đăng nhập
          </h2>
          <p className="text-red-500 text-sm h-2 mb-8">{error}</p>
          <form className="space-y-10" onSubmit={handleLogin}>
            <div className="relative">
              <FaUser className="absolute left-3 top-4 text-gray-400 text-lg" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={email}
                onChange={handleInputChange}
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-400 text-lg" />
              <input
                type="password"
                name="password"
                placeholder="password"
                className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={password}
                onChange={handleInputChange}
                autoComplete="password"
              />
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2 w-[20px] h-[20px]" />
              <label className="text-lg text-gray-600">
                Remember Password
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gray-900 text-white rounded-lg text-lg font-semibold hover:bg-gray-700 transition"
            >
              ĐĂNG NHẬP →
            </button>

            <GoogleOAuthProvider clientId="752749487215-thp4udmogerl7g825rfnfvc33gfieq4t.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </GoogleOAuthProvider>

          </form>
          <p className="mt-6 text-lg text-center text-gray-500 flex justify-center gap-5">
            Bạn chưa có tài khoản?{" "}
            <Link to="/Register" className="text-gray-700 font-semibold">
              Tạo tài khoản của bạn tại đây!
            </Link>
          </p>
          <p className="mt-6 text-lg text-center text-gray-500 flex justify-center gap-5">
            Quên mật khẩu?{" "}
            <Link
              to="/resend-forgot-password"
              className="text-gray-700 font-semibold"
            >
              Khôi phục!
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);
}

export default Login;
