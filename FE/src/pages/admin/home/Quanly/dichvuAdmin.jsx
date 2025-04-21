import { useState } from "react";
import useApiManagerAdmin from "../../../../hook/useApiManagerAdmin";
import RoomTable from "../../../../component/admin/RoomTable";
import SearchBar from "../../../../component/admin/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import {
  CloseModalForm,
  OpenModalForm,
} from "../../../../Store/filterModalForm";

function DichvuAdmin() {
  const dispatch = useDispatch();
  const { modalType, idModal, isOpen } = useSelector(
    (state) => state.ModalForm
  );
  const [data, setData] = useState({
    tien_dien: 0,
    tien_nuoc: 0,
    tien_wifi: 0,
  });
  const {
    data: dichvu,
    createData,
    DeleteData,
    UpdateData,
  } = useApiManagerAdmin("/dich-vu");

  const headers = [
    { label: "ID", key: "_id" },
    { label: "Tiền điện", key: "tien_dien" },
    { label: "Tiền nước", key: "tien_nuoc" },
    { label: "Tiền wifi", key: "tien_wifi" },
  ];
  const handleDelete = async (room) => {
    await DeleteData(room._id);
  };

  const handleCreate = async () => {
    if (modalType === "create") {
      await createData(data);
    } else if (modalType === "edit") {
      await UpdateData(idModal, data);
    }
    setData({
      tien_dien: 0,
      tien_nuoc: 0,
      tien_wifi: 0,
    });
    dispatch(CloseModalForm());
  };

  const handleOpenModalEdit = async (room) => {
    setData((prevData) => ({
      ...prevData,
      tien_dien: room.tien_dien,
      tien_nuoc: room.tien_nuoc,
      tien_wifi: room.tien_wifi,
    }));
    dispatch(OpenModalForm({ modalType: "edit", id: room._id ?? null }));
  };

  const handleClose = async () => {
    dispatch(CloseModalForm());
    setData({
      tien_dien: 0,
      tien_nuoc: 0,
      tien_wifi: 0,
    });
  };
  const handleDeleteAll = () => {};
  return (
    <div className="min-h-screen">
      <div className="flex gap-5 ">
        <SearchBar />
        <button
          className="bg-customBlue text-white p-3 rounded-lg hover:bg-sky-600"
          onClick={() => {
            dispatch(OpenModalForm({ modalType: "create", id: null }));
          }}
        >
          Thêm dịch vụ
        </button>
        <button
          className="bg-red-600 text-white p-3 rounded-lg hover:bg-sky-600"
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </button>
      </div>
      <RoomTable
        title={"Dịch vụ"}
        headers={headers}
        displayedRooms={dichvu}
        roomsPerPage={5}
        handleDelete={handleDelete}
        handleOpenModalEdit={handleOpenModalEdit}
      />
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] w-1/4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">
                {modalType === "edit" ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ"}
              </h2>
              <button
                className="bg-red-500 text-white p-2 rounded-lg"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <p className="text-lg">Tiền điện</p>
                <input
                  type="number"
                  className="py-2 px-3 border border-gray-500 outline-none rounded-lg w-full"
                  placeholder="Tiền điện"
                  value={data.tien_dien}
                  onChange={(e) =>
                    setData((prevData) => ({
                      ...prevData,
                      tien_dien: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <p className="text-lg">Tiền nước</p>
                <input
                  type="number"
                  className="py-2 px-3 border border-gray-500 outline-none rounded-lg w-full"
                  placeholder="Tiền nước"
                  value={data.tien_nuoc}
                  onChange={(e) =>
                    setData((prevData) => ({
                      ...prevData,
                      tien_nuoc: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <p className="text-lg">Tiền wifi</p>
                <input
                  type="number"
                  className="py-2 px-3 border border-gray-500 outline-none rounded-lg w-full"
                  placeholder="Tiền wifi"
                  value={data.tien_wifi}
                  onChange={(e) =>
                    setData((prevData) => ({
                      ...prevData,
                      tien_wifi: e.target.value,
                    }))
                  }
                />
              </div>
            </form>
            <button
              onClick={handleCreate}
              className="mt-10 py-2 px-10 bg-customBlue rounded-lg text-white"
            >
              {modalType === "edit" ? "Chỉnh sửa" : "Tạo"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DichvuAdmin;
