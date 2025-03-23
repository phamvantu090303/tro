import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import RoomTable from "../../../component/admin/RoomTable";
import { usePhongTro } from "../../../Context/PhongTroContext";
import useApiManagerAdmin from "../../../hook/useApiManagerAdmin";

function ThietBiAdmin() {
  const [modal, setModal] = useState(false);
  const [maphong, setMaphong] = useState("");
  const [thietbi, setThietbi] = useState("");
  const [soluong, setSoluong] = useState("");
  const [trangThai, setTrangthai] = useState(0);
  const { phongTro } = usePhongTro();

  const {
    data: thietBi,
    createData,
    DeleteData,
    DeleteAllData,
    UpdateData,
    fetchData,
  } = useApiManagerAdmin("/thiet-bi");

  useEffect(() => {
    fetchData();
  }, []);

  const headers = [
    {
      label: "Mã phòng",
      key: "ma_phong",
    },
    {
      label: "Tên thiết bị",
      key: "ten_thiet_bi",
    },
    {
      label: "Số lượng thiết bị",
      key: "so_luong_thiet_bi",
    },
    {
      label: "Trạng thái",
      key: "trang_thai",
    },
  ];

  const renderStatus = (status) => (
    <select
      value={status.trang_thai}
      className="p-1 border rounded"
      onChange={(e) => handleUpdateTrangThai(status._id, e.target.value)}
    >
      <option value={1}>Hoạt động</option>
      <option value={0}>Không hoạt động</option>
    </select>
  );

  const handleCreate = async () => {
    const success = await createData({
      ma_phong: maphong,
      ten_thiet_bi: thietbi,
      so_luong_thiet_bi: soluong,
      trang_thai: trangThai,
    });
    if (success) {
      setModal(false);
      setMaphong("");
      setThietbi("");
      setSoluong("");
      setTrangthai("");
    }
  };

  const handleDeleteAll = async () => {
    await DeleteAllData();
  };

  // Xóa một danh mục sử dụng DeleteData từ hook
  const handleDelete = async (room) => {
    await DeleteData(room._id);
  };

  //update sử dụng updaatData từ hook
  const handleUpdateTrangThai = async (id, value) => {
    await UpdateData(id, { trang_thai: value });
  };

  return (
    <div className="space-y-10">
      <div className="flex gap-5 ">
        <SearchBar />
        <button
          className="bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600"
          onClick={() => setModal(true)}
        >
          Thêm thiết bị
        </button>
        <button
          className="bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600"
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </button>
      </div>
      <RoomTable
        headers={headers}
        title={"Thiết bị"}
        displayedRooms={thietBi}
        roomsPerPage={10}
        renderStatus={renderStatus}
        handleDelete={handleDelete}
        updateTrangthai={handleUpdateTrangThai}
      />
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">Thêm thiết bị </h2>
              <button
                className="bg-red-500 text-white p-2 rounded-lg"
                onClick={() => setModal(null)}
              >
                Close
              </button>
            </div>
            <div className="space-y-5  mt-4">
              <div className="flex gap-5">
                <select
                  className="border py-3 px-5 rounded-md w-full border-gray-500"
                  onChange={(e) => setMaphong(e.target.value)}
                  name="maMap"
                >
                  <option value="">Chọn mã phòng</option>
                  {phongTro.map((dm) => (
                    <option key={dm.ma_phong} value={dm.ma_phong}>
                      {dm.ma_phong}
                    </option>
                  ))}
                </select>
                <select
                  onChange={(e) => setThietbi(e.target.value)}
                  className="border py-3 px-5 rounded-md w-full  border-gray-500"
                >
                  <option value="">Chọn thiết bị</option>
                  <option value="Quạt hơi nước">Quạt hơi nước</option>
                  <option value="Điều hòa">Điều hòa</option>
                  <option value="Tủ lạnh">Tủ lạnh</option>
                  <option value="Máy giặt">Máy giặt</option>
                  <option value="Bình nóng lạnh">Bình nóng lạnh</option>
                  <option value="Bếp gas">Bếp gas</option>
                  <option value="Lò vi sóng">Lò vi sóng</option>
                  <option value="Nồi cơm điện">Nồi cơm điện</option>
                  <option value="Ấm đun nước">Ấm đun nước</option>
                  <option value="Máy lọc nước">Máy lọc nước</option>
                  <option value="Tủ quần áo">Tủ quần áo</option>
                  <option value="Giường">Giường</option>
                  <option value="Bàn ghế">Bàn ghế</option>
                  <option value="Kệ sách">Kệ sách</option>
                  <option value="Đèn ngủ">Đèn ngủ</option>
                  <option value="Tivi">Tivi</option>
                  <option value="Wifi">Wifi</option>
                  <option value="Loa Bluetooth">Loa Bluetooth</option>
                  <option value="Rèm cửa">Rèm cửa</option>
                  <option value="Ban công">Ban công</option>
                  <option value="Máy chiếu">Máy chiếu</option>
                </select>
              </div>
              <input
                type="number"
                placeholder="Số lượng thiết bị"
                className="py-3 px-5 border border-gray-500 rounded-lg"
                onChange={(e) => setSoluong(e.target.value)}
              />
              <select
                onChange={(e) => setTrangthai(e.target.value)}
                className="border bg-white border-gray-300 px-3 py-3 rounded-lg w-[60%]"
              >
                <option value="">Chọn trạng thái</option>
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
            </div>
            <button
              onClick={handleCreate}
              className="mt-10 py-2 px-10 bg-customBlue rounded-lg text-white"
            >
              Tạo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThietBiAdmin;
