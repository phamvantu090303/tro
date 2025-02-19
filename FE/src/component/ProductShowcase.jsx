import CardRoom from "./CardRoom";
function ProductShowcase({ data, desc, limit, link }) {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <div className="flex gap-2 items-center">
            <p className="text-[#23274A] font-bold text-xl md:text-2xl">
              {desc}
            </p>
          </div>
          <div className="w-[80px] md:w-[117px] h-[4px] bg-[#FEBB02] mt-4 md:mt-8"></div>
        </div>
      </div>

      <div className="mt-6 md:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          {data.slice(0, limit).map((item, index) => (
            <CardRoom
              key={index}
              id={item.ma_phong}
              price={item.gia_tien}
              title={item.ten_phong_tro}
              img={item.anh_phong}
              number={item.so_luong_nguoi}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductShowcase;
