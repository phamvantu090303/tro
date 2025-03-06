import { useSelector, useDispatch } from "react-redux";
import { CloseModalForm } from "../../Store/filterModalForm";

function ModalUser() {
  const dispatch = useDispatch();
  const { modalType, isOpen } = useSelector((state) => state.ModalForm);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative">
        {/* Nút đóng modal */}
        <button
          onClick={() => dispatch(CloseModalForm())}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✖
        </button>

        {/* Tiêu đề modal */}
        <h2 className="text-lg font-semibold mb-4 text-center">
          {modalType === "repair"
            ? "Sửa chữa đồ dùng"
            : modalType === "payment"
            ? "Thanh toán hóa đơn"
            : "Yêu cầu cá nhân"}
        </h2>

        {/* Nội dung modal */}
        {modalType === "repair" && (
          <div>
            <div>
              <label className="block text-gray-700 mb-2">Mã phòng:</label>
              <input
                type="text"
                className="w-full border rounded p-2 mb-4"
                placeholder="Nhập mã phòng"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Mô tả vấn đề:</label>
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows={3}
                placeholder="Nhập mô tả..."
              />
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Gửi yêu cầu sửa chữa
            </button>
          </div>
        )}

        {modalType === "payment" && (
          <div>
            <p className="text-gray-700 mb-4">
              Bạn có chắc chắn muốn thanh toán hóa đơn này?
            </p>
            <div className="flex justify-between">
              <button
                className="w-1/2 bg-gray-300 text-black py-2 rounded mr-2 hover:bg-gray-400"
                onClick={() => dispatch(closeModal())}
              >
                Hủy
              </button>
              <button className="w-1/2 bg-green-500 text-white py-2 rounded hover:bg-green-600">
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        )}

        {modalType === "request" && (
          <div>
            <label className="block text-gray-700 mb-2">Nhập yêu cầu:</label>
            <input
              type="text"
              className="w-full border rounded p-2 mb-4"
              placeholder="Nhập nội dung..."
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Gửi yêu cầu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalUser;
