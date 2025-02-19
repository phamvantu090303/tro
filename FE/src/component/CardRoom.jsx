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
      className="w-full md:max-w-[300px] shadow-xl bg-white p-4 rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
      onClick={() => handleCard(id)}
    >
      <div className="w-full  min-h-[200px] md:h-[220px] flex items-center justify-center">
        <img
          src={img || test}
          alt="room"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="mt-4">
        <p className="text-lg font-bold text-[#23284C]">{title}</p>
        <p className="mt-2 text-lg text-[#FEBB02] font-bold">
          {price} VND / Deposit
        </p>
        <p className="flex items-center gap-2 text-xl">
          <FaUserFriends className="text-2xl text-gray-600" /> {number}
        </p>
      </div>
    </div>
  );
}

export default CardRoom;
