import { useState, useEffect } from "react";
import { axiosInstance } from "../../../Axios";
import CitySelector from "./CitySelector";
import CardRoom from "../CardRoom";

function Category() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (!selectedCategoryId) return;
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/phongTro/get");
        const filteredProducts = res.data.data.filter(
          (product) => product.ma_danh_muc === selectedCategoryId
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phòng trọ:", error);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);
  console.log(products);
  return (
    <div className="mt-[40px]">
      <div className="items-end">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[#23274A] font-bold text-2xl">Category</p>
            <CitySelector onSelectCity={setSelectedCategoryId} />
          </div>
          <div className="w-[117px] h-[4px] bg-[#FEBB02] mt-8"></div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="mt-8 min-h-[00px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          {products.length > 0 ? (
            products.slice(0, 5).map((product) => (
              <div key={product.id}>
                <CardRoom
                  id={product.ma_phong}
                  price={product.gia_tien}
                  title={product.ten_phong_tro}
                  img={product.anh_phong}
                  number={product.so_luong_nguoi}
                />
              </div>
            ))
          ) : (
            <p className="text-3xl font-bold text-center w-full mx-auto">
              Không có phòng trọ nào.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
