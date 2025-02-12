import { FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";

function CardSearch() {
  return (
    <div className="flex py-5 px-[15px] gap-[31px]">
      <img src="" alt="" className="w-[285px] h-[200px]" />
      <div>
        <div className="flex justify-between items-center">
          <p className="text-xl">The Fullerton Hotel Singapore</p>
          <div className="flex gap-3">
            <FaUserFriends className="font-medium text-2xl  " />
            <p className="text-base">2</p>
          </div>
        </div>
        <p className="text-sm mt-1">
          With a stay at The Fullerton Hotel Singapore, you'll be centrally
          located in Singapore, steps from Cavenagh Bridge and Anderson Bridge.
          This 5-star hotel is close to Chinatown Heritage Center and Universal
          Studios Singapore®......more
        </p>
        <div className="flex gap-2 mt-[22px]">
          <FaMapMarkerAlt className="text-[#23274A] text-lg" />
          <p className="text-sm">1 Fullerton Square</p>
        </div>
        <button className="bg-[#23284C] text-white rounded-lg text-lg py-[10px] px-[56px] mt-[18px]">
          Select
        </button>
      </div>
    </div>
  );
}

export default CardSearch;
