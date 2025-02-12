import "react-toastify/dist/ReactToastify.css";
import test from "../assets/test.png";
import { FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router";
function CardRoom({ id, price, img, title, number }) {
  const navigate = useNavigate();
  const handleCard = async (e) => {
    try {
      navigate(`/details/${e}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="w-[270px] shadow-xl bg-white p-[10px] cursor-pointer"
      onClick={() => handleCard(id)}
    >
      <div className="flex items-center justify-center ">
        <img
          src={img || test}
          alt=""
          className="object-cover w-[290px] h-[220px]"
        />
      </div>
      <div className="mt-5">
        <p className="text-lg font-bold text-[#23284C]">{title}</p>
        <p className="mt-2 text-lg text-[#FEBB02] font-bold">
          {price} VND / Month
        </p>
        <p className="flex items-center gap-[10px] text-xl">
          <FaUserFriends className="font-medium text-2xl  " /> {number}
        </p>
      </div>
    </div>
  );
}

export default CardRoom;
