import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaAngleDown, FaAngleUp, FaEye } from "react-icons/fa";
import { axiosInstance } from "../Axios";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useCart } from "../Context/CartContext";
function CardRoom({ id, price, img, title, sales, icon }) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { updateCartQuantity } = useCart();

  const fetchAddCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (soluong == 0) {
      toast.error("Please enter a quantity greater than 0");
      return;
    }
    try {
      await axiosInstance.post("/api/cart/add", {
        UserID: user.ID,
        BookID: id,
        quantity: soluong,
      });
      updateCartQuantity(user.ID);
      toast.success("Add to cart successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Add to cart failed!");
    }
  };
  const handleDetail = async (e) => {
    try {
      navigate(`/productDetail/${e}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="w-[270px] h-[350px] group hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer rounded-xl border border-gray-200">
        <div className="relative bg-gray-100 w-[269px] h-[250px] flex items-center justify-center rounded-t-xl overflow-hidden">
          <img src={img} alt="" className="object-contain" />
          <div className="flex flex-col absolute top-[17px] right-[17px] gap-2">
            <CiHeart className="w-[30px] h-[30px] p-1 bg-white rounded-full cursor-pointer" />
            <FaEye
              className="w-[30px] h-[30px] p-1 bg-white rounded-full cursor-pointer"
              onClick={() => handleDetail(id)}
            />
          </div>
          <div className="absolute bottom-[-50px] left-0 w-full flex justify-between items-center bg-black text-white py-2 transition-all duration-300 ease-in-out group-hover:bottom-0">
            <button
              className="px-4 py-2 text-sm font-semibold"
              onClick={fetchAddCart}
            >
              Add to Cart
            </button>
            <div className="flex py-3 px-[6px] mr-4 justify-around border border-gray-500 items-center rounded-md w-[70px] h-[34px] cursor-pointer">
              <input
                type="text"
                className="w-[40px] outline-none bg-inherit"
                value={soluong}
                onChange={handleinput}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-[16px] font-medium">{title}</p>
          <div className="flex mt-2 gap-3">
            <p className="text-black font-medium">${price}</p>
            {sales && (
              <p className="text-gray-400 font-medium line-through">${sales}</p>
            )}
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <img src={icon} alt="" />
          <img src={icon} alt="" />
          <img src={icon} alt="" />
          <img src={icon} alt="" />
          <img src={icon} alt="" />
        </div>
      </div>
    </div>
  );
}

export default CardRoom;
