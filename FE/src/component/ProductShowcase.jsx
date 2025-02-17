import { Link } from "react-router";
import CardRoom from "./CardRoom";
function ProductShowcase({ data, desc, limit, link }) {
  return (
    <div className="">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex gap-[10px] items-center">
            <p className="text-[#23274A] font-bold text-2xl ">{desc}</p>
          </div>
          <div className="w-[117px] h-[4px] bg-[#FEBB02] mt-8"></div>
        </div>
      </div>
      <div className="mt-8">
        <div className="grid grid-cols-5 gap-y-14 ">
          {data.slice(0, limit).map((item, index) => (
            <div key={index}>
              <CardRoom
                id={item.ma_phong}
                price={item.gia_tien}
                title={item.ten_phong_tro}
                img={item.anh_phong}
                number={item.so_luong_nguoi}
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-[60px]"></div>
      </div>
    </div>
  );
}

export default ProductShowcase;
