import "react-toastify/dist/ReactToastify.css";
import test from "../assets/test.png";
function CardRoom({ id, price, img, title, icon }) {
  return (
    <div>
      <div className="w-[270px] h-[350px] ">
        <div className="flex items-center justify-center rounded-t-xl overflow-hidden">
          <img
            src={img || test}
            alt=""
            className="object-contain w-[295px] h-[220px]"
          />
        </div>
        <div className="mt-8">
          <p className="text-lg font-bold text-[#23284C]">{title}</p>
          <p className="mt-2 text-lg text-[#FEBB02] font-bold">
            {price} VND / Month
          </p>
          <p className="font-medium mt-2"></p>
        </div>
      </div>
    </div>
  );
}

export default CardRoom;
