import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { axiosInstance } from "../../../Axios";
import CardSearch from "../../component/Search/CardSearch";
function Search() {
  const [search, setSearch] = useState("");
  const [dataSearch, setDataSearch] = useState([]);

  const fetchSearch = async () => {
    const res = await axiosInstance.get("", {
      params: { query: term },
    });
    const sortedBooks = res.data.data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setDataSearch(sortedBooks);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value) {
      fetchSearch(value);
    } else {
      setDataSearch([]);
    }
  };
  return (
    <div className="w-full">
      <div className="max-w-[1920px] mx-auto px-[150px] mt-[78px] flex gap-[59px]">
        <div>
          <div className="bg-[#282C4E] py-[22px] px-[18px] rounded-lg">
            <p className="text-base text-white mb-[11px]">Tìm kiếm phòng trọ</p>
            <div className="relative flex max-w-[259px] h-11">
              <CiSearch className="absolute top-[30%] left-3 text-xl" />
              <input
                type="text"
                placeholder="Da nang"
                className="pl-[42px] rounded-lg"
                onChange={handleChange}
                value={search}
              />
            </div>
          </div>
          <h3 className="text-lg font-bold text-[#23274A] my-8">Lọc kết quả</h3>
          <div className="bg-[#282C4E] rounded-lg">
            <p className="text-base text-white  py-[22px] px-[18px]">Tầm giá</p>
            <div className="bg-white  py-[22px] px-[18px] flex flex-col gap-[15px]">
              <div className="flex gap-3">
                <input type="checkbox" className="text-[#333333] w-5 h-5" />
                <p className="text-[#333333]">$ 0 - $ 200</p>
              </div>
              <div className="flex gap-3">
                <input type="checkbox" className="text-[#333333] w-5 h-5" />
                <p className="text-[#333333]">$ 200 - $ 500</p>
              </div>
              <div className="flex gap-3">
                <input type="checkbox" className="text-[#333333] w-5 h-5" />
                <p className="text-[#333333]">$ 500 - $ 1,000</p>
              </div>
              <div className="flex gap-3">
                <input type="checkbox" className="text-[#333333] w-5 h-5" />
                <p className="text-[#333333]">$ 1,000 - $ 2,000</p>
              </div>
              <div className="flex gap-3">
                <input type="checkbox" className="text-[#333333] w-5 h-5" />
                <p className="text-[#333333]">$ 2,000 - $ 5,000</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="font-bold text-2xl">Kết quả tìm kiếm : {search}</p>
          <CardSearch />
        </div>
      </div>
    </div>
  );
}

export default Search;
