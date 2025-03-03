import { useDispatch, useSelector } from "react-redux";
import { closeConfirmModal } from "../Store/filterConfirmModal";
import { axiosInstance } from "../../Axios";

function ModalConFirm({ id, reload }) {
  const dispatch = useDispatch();
  const { modalType, idModal } = useSelector((state) => state.confirmModal);
  const handleConfirm = async () => {
    console.log(idModal);
    if (modalType === "delete") {
      await handleDelete(idModal);
    }
    reload();
    dispatch(closeConfirmModal());
  };
  const handleDelete = async (id) => {
    await axiosInstance.delete(`/map/deleteMap/${id}`);
  };

  return (
    <div>
      {idModal === id && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-medium">
              {modalType === "delete"
                ? "Bạn có chắc chắn muốn xóa?"
                : "Bạn có muốn lưu này?"}
            </p>
            <div className="flex justify-center gap-5 mt-4">
              <button
                className="text-lg text-red-500 rounded-lg px-4 py-2"
                onClick={handleConfirm}
              >
                {modalType === "delete" ? "Xóa" : "Lưu"}
              </button>
              <button
                className="text-lg border border-gray-500 rounded-lg px-4 py-2 ml-2"
                onClick={() => dispatch(closeConfirmModal())}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModalConFirm;
