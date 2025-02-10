import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { Link } from "react-router";
import CardRoom from "./CardRoom";

function ProductShowcase({ data, title, desc, limit, link }) {
  console.log(data);
  return (
    <div className="mt-[140px] ">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex gap-[10px] items-center">
            <p className="text-red-500 font-semibold text-xl ">{desc}</p>
            <span className="w-[20px] h-[40px] bg-red-500 rounded-md"></span>
          </div>
          <div>
            <h3 className="text-4xl font-semibold mt-6">{title}</h3>
          </div>
        </div>
        <div className="flex gap-2">
          <IoArrowBack className="text-[50px]  bg-gray-300 text-black px-4 py-2 rounded-full hover:bg-gray-700" />

          <IoArrowForward className="text-[50px] bg-gray-300 text-black px-4 py-2 rounded-full hover:bg-gray-700" />
        </div>
      </div>
      <div className="mt-10">
        <div className="flex gap-9 gap-y-14 ">
          {data.slice(0, limit).map((item, index) => (
            <div key={index} className="">
              <CardRoom
                id={item._id}
                price={item.gia_tien}
                title={item.ten_phong_tro}
                img={item.Img}
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-[60px]">
          <Link to={link}>
            <button className="py-4 px-12 bg-red-500 text-white font-medium hover:bg-red-600">
              View All Product
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductShowcase;
