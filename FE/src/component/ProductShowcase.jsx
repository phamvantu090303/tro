import CardRoom from "./CardRoom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ProductShowcase({ data, desc, limit, link, slide }) {
  const settings = {
    dots: false,
    infinite: data.length > 1,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    rtl: true,
    responsive: [
      {
        breakpoint: 1600, // Laptop màn lớn
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1280, // Laptop phổ thông
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024, // Laptop nhỏ hơn (13 inch)
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // Tablet & Mobile
        settings: {
          slidesToShow: 1,
          vertical: true,
          verticalSwiping: true,
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

      {/* Kiểm tra nếu slide === true thì dùng Slider, nếu không thì dùng Grid */}
      {slide ? (
        <Slider
          {...settings}
          className="mt-[33px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6"
        >
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
      ) : (
        <div className="mt-[33px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
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
        </div>
      )}

      <div className="mt-6 md:mt-8 flex justify-center">
        <button className="px-12 py-4 text-base font-medium bg-[#23284C] text-white rounded-lg hover:bg-[#2a306e]">
          Xem toàn bộ
        </button>
      </div>
    </div>
  );
}

export default ProductShowcase;
