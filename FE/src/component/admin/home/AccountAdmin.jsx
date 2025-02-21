import { useEffect, useState, useCallback } from 'react';
import SearchBar from '../../admin/home/SearchBar';
import { axiosInstance } from '../../../../Axios';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

const defaultAdmin = {
  id_quyen: '',
  username: '',
  password: '',
  email: '',
  ho_va_ten: '',
  ngay_sinh: '',
  que_quan: '',
  so_dien_thoai: '',
  gioi_tinh: 'Nam', 
  cccd: '', 
};

export default function AccountAdmin() {
  const [user, setUser] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState(null);
  const [adminData, setAdminData] = useState(defaultAdmin);
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredUser.length / itemsPerPage);
  const currentData = filteredUser.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fetchAccount = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('admin/AllAdmin');
      const users = response.data.data || [];
      setUser(users);
      setFilteredUser(users);
    } catch {
      setError('Không tải được admins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAccount(); }, [fetchAccount]);

  const handleSubmit = async () => {
    try {
      if (modalType === 'edit') {
        await axiosInstance.post(`/admin/update/${adminData._id}`, adminData);
        alert('Admin đã cập nhật thành công!');
      } else {
        await axiosInstance.post(`/admin/create`, adminData);
        alert('Admin tạo ra thành công!');
      }
      fetchAccount();
      closeModal();
    } catch {
      setError('Không xử lý được yêu cầu');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await axiosInstance.delete(`/admin/delete/${id}`);
        alert('Admin đã xóa thành công!');
        fetchAccount();
      } catch {
        setError('Không xóa được admin user.');
      }
    }
  };

  const toggleBlock = async (admin) => {
    try {
      const updatedStatus = !admin.is_block;
      await axiosInstance.post(`/admin/update/${admin._id}`, { ...admin, is_block: updatedStatus });
      
      alert(`Admin ${updatedStatus ? 'blocked' : 'unblocked'} successfully!`);
      
      // Cập nhật danh sách user mà không cần gọi lại API
      setUser((prevUsers) =>
        prevUsers.map((u) => (u._id === admin._id ? { ...u, is_block: updatedStatus } : u))
      );
      setFilteredUser((prevUsers) =>
        prevUsers.map((u) => (u._id === admin._id ? { ...u, is_block: updatedStatus } : u))
      );
    } catch {
      setError('Failed to update block status.');
    }
  };


  const openModal = (type, admin = defaultAdmin) => {
    setModalType(type);
    setAdminData(admin);
  };
  
  const closeModal = () => {
    setModalType(null);
    setAdminData(defaultAdmin);
  };

  return (
    <div className='flex h-screen gap-3'>
      <div className='w-full bg-gray-100 p-6 rounded-lg shadow-lg text-black'>
        <h1 className='text-3xl font-bold mb-6'>Acc Admin</h1>

        {modalType && (
          <Modal title={modalType === 'edit' ? 'Edit Admin' : 'Create Admin'} onClose={closeModal}>
            {Object.keys(defaultAdmin).map((key) => (
              <input
                key={key}
                type={key === 'password' ? 'password' : 'text'}
                placeholder={key.replace('_', ' ')}
                value={adminData[key] || ''}
                onChange={(e) => setAdminData({ ...adminData, [key]: e.target.value })}
                className='border bg-white border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500'
              />
            ))}
            <button onClick={handleSubmit} className='bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition'>
              {modalType === 'edit' ? 'Update Admin' : 'Create Admin'}
            </button>
            {error && <p className='text-red-500 mt-2'>{error}</p>}
          </Modal>
        )}

        <div className='flex gap-5'>
          <SearchBar onSearch={(query) => setFilteredUser(user.filter(({ username }) => username.toLowerCase().includes(query.toLowerCase().trim())))} />
          <button className='bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600' onClick={() => openModal('create')}>New Admin</button>
        </div>

        <div className='overflow-x-auto mt-8'>
          <table className='min-w-full bg-white text-left'>
            <thead>
              <tr className='bg-gray-800 text-gray-300'>
                {Object.keys(defaultAdmin).map((key) => <th key={key} className='py-2 pl-3'>{key.replace('_', ' ')}</th>)}
                <th className='py-2 pl-3'>Blocked</th>
                <th className='py-2 pl-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length ? (
                currentData.map((user) => (
                  <tr key={user._id}>
                    {Object.keys(defaultAdmin).map((key) => <td key={key} className='py-2 pl-3'>{user[key] || '-'}</td>)}
                    <td className='py-2 pl-3'>
                      <button
                        className={`p-2 rounded-lg ${user.is_block ? 'bg-red-500' : 'bg-green-500'} text-white`}
                        onClick={() => toggleBlock(user)}
                      >
                        {user.is_block ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                    <td className='py-2 pl-3 flex gap-2'>
                      <button onClick={() => openModal('edit', user)} className='bg-green-500 text-white p-2 rounded-lg hover:bg-green-600'><AiOutlineEdit /></button>
                      <button onClick={() => handleDelete(user._id)} className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-600'><AiOutlineDelete /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={Object.keys(defaultAdmin).length + 2} className='text-center py-2'>No users available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const Modal = ({ title, children, onClose }) => (
  <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
    <div className='bg-white rounded-lg shadow-lg p-6 w-1/4'>
      <h2 className='text-xl font-semibold mb-4'>{title}</h2>
      <button className='bg-red-500 text-white p-2 rounded-lg' onClick={onClose}>Close</button>
      <div className='flex flex-col gap-4'>{children}</div>
    </div>
  </div>
);