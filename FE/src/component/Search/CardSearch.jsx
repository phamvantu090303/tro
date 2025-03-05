import { FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router";

function CardSearch({ma_phong,img,title,noidung,number,dientich,diachi,trangthai,thanhpho,price}) {
  const navigate = useNavigate()
  const handleCard = async (e) => {
    try {
      navigate(`/details/${e}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex py-5 px-[15px] gap-[31px] h-full bg-gray-200 rounded-lg">
      <img src={img} alt="" className="w-[285px] h-[200px]" />
      <div className="w-full h-full flex flex-col justify-between">
        <div className="flex justify-between">
          <p className="text-xl">{title}</p>
          <div className="flex flex-col justify-between">
            <div className="flex gap-3 justify-end">
              <FaUserFriends className="font-medium text-2xl  " />
              <p className="text-base">{number}</p>
            </div>
          </div>
        </div>
        <p className="text-sm mt-1">
         {noidung}
        </p>
        <div className="flex gap-2 mt-[22px]">
          <FaMapMarkerAlt className="text-[#23274A] text-lg" />
          <p className="text-sm">{diachi}</p>
        </div>
        <div>
        <button className="bg-[#23284C] text-white rounded-lg text-lg py-[10px] px-[56px] mt-[18px]" onClick={()=>handleCard(ma_phong)}>
                  Xem
                </button>
        </div>
      </div>
    </div>
  );
}

export default CardSearch;
