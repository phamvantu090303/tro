import { useEffect, useState } from "react";
import RoomTable from "../../../../component/admin/RoomTable";
import useApiManagerAdmin from "../../../../hook/useApiManagerAdmin";
import SearchBar from "../../../../component/admin/SearchBar";

function AccountAdmin() {
  const [modal, setModal] = useState(false);
  const {
    data: admin,
    createData,
    DeleteData,
    UpdateData,
    fetchData,
  } = useApiManagerAdmin("/admin");
  const generateRandomId = () => Math.floor(Math.random() * 1000000).toString();
  const [adminData, setAdminData] = useState({
    id_quyen: "",
    email: "",
    password: "",
    username: "",
    ho_va_ten: "",
    ngay_sinh: "",
    que_quan: "",
    so_dien_thoai: "",
    gioi_tinh: "",
    cccd: "",
    verify: 1,
    is_block: false,
  });

  const headers = [
    { label: "ID quyền", key: "id_quyen" },
    { label: "UserName", key: "username" },
    { label: "Email", key: "email" },
    { label: "Họ và tên", key: "ho_va_ten" },
    { label: "Quê quán", key: "que_quan" },
    { label: "Số điện thoại", key: "so_dien_thoai" },
    { label: "Giới tính", key: "gioi_tinh" },
    { label: "Căn cước công dân", key: "cccd" },
    { label: "Tài khoản bị khóa", key: "is_block" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (modal) {
      setAdminData((prev) => ({ ...prev, id_quyen: generateRandomId() }));
    }
  }, [modal]);

  const handleCreate = async () => {
    const success = await createData({ ...adminData });

    if (success) {
      setModal(false);
    }
  };

  const handleDelete = async (room) => {
    await DeleteData(room._id);
  };

  const handleUpdateBlock = async (id, value) => {
    const newValue = !value;
    await UpdateData(id, { is_block: newValue });
  };

  const renderStatus = (status) => (
    <p
      className={`p-1 border rounded text-white cursor-pointer ${
        status.is_block ? "bg-red-500" : "bg-green-500"
      }`}
      onClick={() => handleUpdateBlock(status._id, status.is_block)}
    >
      {status.is_block ? "Bị khóa" : "Hoạt động"}
    </p>
  );

  return (
    <div>
      <div className="flex gap-5 ">
        <SearchBar />
        <button
          className="bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600"
          onClick={() => setModal(true)}
        >
          Thêm tài khoản admin
        </button>
      </div>
      <RoomTable
        displayedRooms={admin}
        headers={headers}
        roomsPerPage={5}
        title={"Account Admin"}
        renderStatus={renderStatus}
        handleDelete={handleDelete}
        updateTrangthai={handleUpdateBlock}
      />
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] w-[500px]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">
                Thêm tài khoản admin
              </h2>
              <button
                className="bg-red-500 text-white p-2 rounded-lg"
                onClick={() => setModal(false)}
              >
                Close
              </button>
            </div>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block font-medium">Email</label>
                <input
                  type="text"
                  placeholder="Nhập email"
                  value={adminData.email}
                  onChange={(e) =>
                    setAdminData({ ...adminData, email: e.target.value })
                  }
                  className="w-full border border-gray-500 py-2 px-4 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={adminData.password}
                  onChange={(e) =>
                    setAdminData({ ...adminData, password: e.target.value })
                  }
                  className="w-full border border-gray-500 py-2 px-4 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">UserName</label>
                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={adminData.username}
                  onChange={(e) =>
                    setAdminData({ ...adminData, username: e.target.value })
                  }
                  className="w-full border border-gray-500 py-2 px-4 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Họ và tên</label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={adminData.ho_va_ten}
                  onChange={(e) =>
                    setAdminData({ ...adminData, ho_va_ten: e.target.value })
                  }
                  className="w-full border border-gray-500 py-2 px-4 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Ngày sinh</label>
                <input
                  type="date"
                  value={adminData.ngay_sinh}
                  onChange={(e) =>
                    setAdminData({ ...adminData, ngay_sinh: e.target.value })
                  }
                  className="w-full border border-gray-500 py-2 px-4 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Quê quán</label>
                <input
                  type="text"
                  placeholder="Nhập quê quán"
                  value={adminData.que_quan}
                  onChange={(e) =>
                    setAdminData({ ...adminData, que_quan: e.target.value })
                  }
                  className="w-full border border-gray-500 py-2 px-4 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Số điện thoại</label>
                <input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={adminData.so_dien_thoai}
                  onChange={(e) =>
                    setAdminData({
                      ...adminData,
                      so_dien_thoai: e.target.value,
                    })
                  }
                  className="w-full border border-gray-500 py-2 px-4 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">CCCD</label>
                <input
                  type="text"
                  placeholder="Nhập số CCCD"
                  value={adminData.cccd}
                  onChange={(e) =>
                    setAdminData({ ...adminData, cccd: e.target.value })
                  }
                  className="w-full border border-gray-500 py-2 px-4 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Giới tính</label>
                <select
                  className="w-full border border-gray-500 py-2 px-4 rounded-md"
                  value={adminData.gioi_tinh}
                  onChange={(e) =>
                    setAdminData({ ...adminData, gioi_tinh: e.target.value })
                  }
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div>
                <label className="block font-medium">Khoá tài khoản</label>
                <input
                  type="checkbox"
                  checked={adminData.is_block}
                  onChange={(e) =>
                    setAdminData({ ...adminData, is_block: e.target.checked })
                  }
                  className="mr-2"
                />
                <span>Tài khoản bị khoá</span>
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="mt-6 py-2 px-10 bg-customBlue rounded-lg text-white w-full"
            >
              Tạo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountAdmin;
