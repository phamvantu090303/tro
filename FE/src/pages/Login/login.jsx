import { FaUser, FaLock } from "react-icons/fa";
import wallperlogin from "../../assets/roomwallper.jpg";
import { useState } from "react";
import { axiosInstance } from "../../../Axios";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../Store/filterUser";
import { toast } from "react-toastify";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
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
      console.log(error);
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
              Login Here!
            </h2>
            <form className="space-y-10">
              <div className="relative">
                <FaUser className="absolute left-3 top-4 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="username"
                  className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-4 text-gray-400 text-lg" />
                <input
                  type="password"
                  placeholder="password"
                  className="w-full px-10 py-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onChange={(e) => setPassword(e.target.value)}
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
                onClick={handleLogin}
              >
                LOGIN →
              </button>
            </form>
            <p className="mt-6 text-lg text-center text-gray-500 flex justify-center gap-5">
              Don't have an account?{" "}
              <Link to="/Register">
                {" "}
                <p href="#" className="text-gray-700 font-semibold">
                  Create your account here!
                </p>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
