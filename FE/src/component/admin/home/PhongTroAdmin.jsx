import { useEffect, useState } from 'react';
import SearchBar from '../../admin/home/SearchBar';
import { axiosInstance } from '../../../../Axios';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { Select } from 'antd'; // Import Select từ Ant Design

const { Option } = Select;

const defaultAdmin = {
  ma_phong: '',
  id_map: '',
  ma_danh_muc: '',
  id_users: '',
  ten_phong_tro: '',
  dia_chi: '',
  mo_ta: '',
  dien_tich: '',
  gia_tien: '',
  trang_thai: 1,
  so_luong_nguoi: '',
};

const useAdminData = () => {
  const [user, setUser] = useState([]);
  const [danhMucList, setDanhMucList] = useState([]); // State để lưu danh sách mã danh mục
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/phongTro/get');
      setUser(res.data.data || []);
    } catch {
      setError('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const fetchDanhMucList = async () => {
    try {
      const res = await axiosInstance.get('/danh-muc');
      setDanhMucList(res.data.data || []);
    } catch {
      setError('Failed to load category list.');
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchDanhMucList();
  }, []);

  return { user, setUser, danhMucList, searchTerm, setSearchTerm, fetchAccounts, loading, error };
};

export default function PhongTroAdmin() {
  const { user, setUser, danhMucList, searchTerm, setSearchTerm, fetchAccounts, loading, error } = useAdminData();
  const [modal, setModal] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(defaultAdmin);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePhongTro = async () => {
    try {
      if (modal === 'edit') {
        await axiosInstance.post(`/phongTro/update/${selectedAdmin.ma_phong}`, selectedAdmin);
        alert('Updated successfully!');
      } else {
        await axiosInstance.post('/phongTro/create', selectedAdmin);
        alert('Created successfully!');
      }
      setModal(null);
      fetchAccounts();
    } catch {
      alert('Failed to save room.');
    }
  };

  const handleDeletePhongTro = async (ma_phong) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axiosInstance.delete(`/phongTro/delete/${ma_phong}`);
        alert('Deleted successfully!');
        fetchAccounts();
      } catch {
        alert('Failed to delete room.');
      }
    }
  };

  const filteredUsers = user.filter((item) =>
    item.ma_phong.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className='flex h-screen gap-3'>
      <div className='w-full bg-gray-100 p-6 rounded-lg shadow-lg text-black'>
        <h1 className='text-3xl font-bold mb-6'>Phòng Trọ</h1>

        {modal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-1/4'>
              <h2 className='text-xl font-semibold mb-4'>{modal === 'edit' ? 'Edit Room' : 'Create Room'}</h2>
              <button className='bg-red-500 text-white p-2 rounded-lg' onClick={() => setModal(null)}>Close</button>
              <div className='flex flex-col gap-4'>
                {Object.keys(defaultAdmin).map((key) => (
                  key === 'trang_thai' ? (
                    <div key={key}>
                      <label>Trạng thái</label>
                      <Select
                        value={selectedAdmin.trang_thai}
                        onChange={(value) => setSelectedAdmin((prev) => ({ ...prev, trang_thai: value }))}
                        className="border bg-white border-gray-300 p-3 rounded-lg w-full"
                      >
                        <Option value={0}>Chưa thuê</Option>
                        <Option value={1}>Đang thuê</Option>
                        <Option value={2}>Sửa chữa</Option>
                      </Select>
                    </div>
                  ) : key === 'ma_danh_muc' ? (
                    <div key={key}>
                      <label>Mã danh mục</label>
                      <Select
                        value={selectedAdmin.ma_danh_muc}
                        onChange={(value) => setSelectedAdmin((prev) => ({ ...prev, ma_danh_muc: value }))}
                        className="border bg-white border-gray-300 p-3 rounded-lg w-full"
                      >
                        {danhMucList.map((dm) => (
                          <Option key={dm.ma_danh_muc} value={dm.ma_danh_muc}>{dm.ten_danh_muc}</Option>
                        ))}
                      </Select>
                    </div>
                  ) : (
                    <input
                      key={key}
                      type='text'
                      name={key}
                      placeholder={key.replace('_', ' ')}
                      value={selectedAdmin[key] || ''}
                      onChange={handleInputChange}
                      className='border bg-white border-gray-300 p-3 rounded-lg w-full'
                    />
                  )
                ))}
                <button onClick={handleSavePhongTro} className='bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition'>
                  {modal === 'edit' ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className='flex gap-5'>
          <SearchBar onSearch={setSearchTerm} />
          <button className='bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600' onClick={() => { setSelectedAdmin(defaultAdmin); setModal('create'); }}>
            New User
          </button>
          <button className='bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600' onClick={() => { handleDeleteAll() }}>
            Xóa tất cả
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white mt-8 text-left'>
            <thead>
              <tr className='bg-gray-800 text-gray-300'>
                {Object.keys(defaultAdmin).map((key) => <th key={key} className='py-2 pl-3'>{key.replace('_', ' ')}</th>)}
                <th className='py-2 pl-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((admin) => (
                <tr key={admin.ma_phong}>
                  {Object.keys(defaultAdmin).map((key) => (
                    key === 'trang_thai' ? (
                      <td key={key} className='py-2 pl-3'>
                        <Select
                          value={admin.trang_thai}
                          onChange={async (value) => {
                            try {
                              await axiosInstance.post(`/phongTro/update/${admin.ma_phong}`, {
                                ...admin,
                                trang_thai: value
                              });
                              fetchAccounts();
                            } catch {
                              alert('Cập nhật trạng thái thất bại!');
                            }
                          }}
                          className="border bg-white border-gray-300 p-3 rounded-lg w-full"
                        >
                          <Option value={0}>Chưa thuê</Option>
                          <Option value={1}>Đang thuê</Option>
                          <Option value={2}>Sửa chữa</Option>
                        </Select>
                      </td>
                    ) : (
                      <td key={key} className='py-2 pl-3'>{admin[key] || '-'}</td>
                    )
                  ))}
                  <td className='py-2 pl-3 flex gap-2'>
                    <button onClick={() => { setSelectedAdmin(admin); setModal('edit'); }} className='bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition'>
                      <AiOutlineEdit />
                    </button>
                    <button onClick={() => handleDeletePhongTro(admin.ma_phong)} className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition'>
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
