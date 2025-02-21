import CardRoom from "./CardRoom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function ProductShowcase({ data, desc, limit, link }) {
  const settings = {
    dots: false,
    infinite: data.length > 1,
    speed: 500,
    slidesToShow: Math.min(5, data.length), // Số lượng card hiển thị cùng lúc
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    rtl: true, // Chạy từ phải qua trái
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, data.length), // Tránh chỉ hiển thị 1 item
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1, // Chuyển sang hàng dọc khi mobile
          vertical: true, // Kích hoạt chế độ trượt dọc
          verticalSwiping: true, // Cho phép vuốt dọc
        },
      },
    ],
  };
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

      <Slider {...settings} className="mt-[33px]">
        {data.slice(0, limit).map((item, index) => (
          <CardRoom
            key={index}
            id={item.ma_phong}
            price={item.gia_tien}
            title={item.ten_phong_tro}
            img={item.anh_phong}
            number={item.so_luong_nguoi}
            dien_tich={item.dien_tich}
            address={item.mapDetail?.address}
            district={item.mapDetail?.district}
            province={item.mapDetail?.province}
            ward={item.mapDetail?.ward}
          />
        ))}
      </Slider>

      <div className="mt-6 md:mt-8 flex justify-center">
        <button className="px-12 py-4 text-base font-medium bg-[#23284C] text-white rounded-lg  hover:bg-[#2a306e]">
          Xem toàn bộ
        </button>
      </div>
    </div>
  );
}

export default ProductShowcase;
