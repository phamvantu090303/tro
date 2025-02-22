import { useEffect, useState } from 'react';
import SearchBar from '../../admin/home/SearchBar';
import { axiosInstance } from '../../../../Axios';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { Select } from 'antd';

const { Option } = Select;

const defaultAdmin = {
    ma_phong: '',
    ten_thiet_bi: '',
    so_luong_thiet_bi: '',
    trang_thai: '',
};

const useAdminData = () => {
    const [user, setUser] = useState([]);
    const [maPhongList, setMaPhongList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMaPhong, setSelectedMaPhong] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/thiet-bi');
            setUser(res.data.data || []);
        } catch {
            setError('Failed to load devices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return {
        user, setUser,
        searchTerm, setSearchTerm,
        selectedMaPhong, setSelectedMaPhong,
        fetchAccounts, loading, error
    };
};

export default function DanhMucAdmin() {
    const {
        user, setUser,
        searchTerm, setSearchTerm,
        selectedMaPhong, setSelectedMaPhong,
        fetchAccounts, loading, error
    } = useAdminData();

    const [modal, setModal] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(defaultAdmin);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedAdmin((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveDanhMuc = async () => {
        try {
            if (modal === 'edit') {
                await axiosInstance.post(`/thiet-bi/update/${selectedAdmin._id}`, selectedAdmin);
                alert('Updated successfully!');
            } else {
                await axiosInstance.post('/thiet-bi/create', selectedAdmin);
                alert('Created successfully!');
            }
            setModal(null);
            fetchAccounts();
        } catch {
            alert('Failed to save device.');
        }
    };

    const handleDeleteDanhMuc = async (_id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axiosInstance.delete(`/thiet-bi/delete/${_id}`);
                alert('Deleted successfully!');
                fetchAccounts();
            } catch {
                alert('Failed to delete device.');
            }
        }
    };

    const handleDeleteAll = async () => {
        if (window.confirm('Are you sure?')) {
            try {
                await axiosInstance.delete(`/thiet-bi/delete/all`);
                alert('Deleted successfully!');
                fetchAccounts();
            } catch {
                alert('Failed to delete all devices.');
            }
        }
    };

    const filteredUsers = user.filter((item) =>
        (selectedMaPhong ? item.ma_phong === selectedMaPhong : true) &&
        item.ma_phong.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    return (
        <div className='flex h-screen gap-3'>
            <div className='w-full bg-gray-100 p-6 rounded-lg shadow-lg text-black'>
                <h1 className='text-3xl font-bold mb-6'>Thiết Bị</h1>

                {modal && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
                        <div className='bg-white rounded-lg shadow-lg p-6 w-1/4'>
                            <h2 className='text-xl font-semibold mb-4'>{modal === 'edit' ? 'Edit Admin' : 'Create Admin'}</h2>
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
                                                <Option value={0}>Dừng hoạt động</Option>
                                                <Option value={1}>Đang hoạt động</Option>
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
                                            className='border bg-white border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500'
                                        />
                                    )
                                ))}
                                <button onClick={handleSaveDanhMuc} className='bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition'>
                                    {modal === 'edit' ? 'Update' : 'Create'}
                                </button>
                                {error && <p className='text-red-500 mt-2'>{error}</p>}
                            </div>
                        </div>
                    </div>
                )}

                <div className='flex gap-5'>
                    <SearchBar onSearch={setSearchTerm} />

                    <Select
                        placeholder="Chọn mã phòng"
                        value={selectedMaPhong}
                        onChange={(value) => {
                            setSelectedMaPhong(value);
                        }}
                        className="border bg-white border-gray-300 p-3 rounded-lg"
                    >
                        {Array.from(new Set(user.map((item) => item.ma_phong))).map((maPhong) => (
                            <Option key={maPhong} value={maPhong}>{maPhong}</Option>
                        ))}
                    </Select>


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
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((admin) => (
                                    <tr key={admin._id}>
                                        {Object.keys(defaultAdmin).map((key) => {
                                            if (key === 'trang_thai') {
                                                return (
                                                    <td key={key} className='py-2 pl-3'>
                                                        <Select
                                                            value={admin.trang_thai}
                                                            onChange={async (value) => {
                                                                try {
                                                                    await axiosInstance.post(`/thiet-bi/update/${admin._id}`, {
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
                                                            <Option value={0}>Dừng hoạt động</Option>
                                                            <Option value={1}>Đang hoạt động</Option>
                                                        </Select>
                                                    </td>
                                                );
                                            }

                                            return <td key={key} className='py-2 pl-3'>{admin[key] || '-'}</td>;
                                        })}
                                        <td className='py-2 pl-3 flex gap-2'>
                                            <button onClick={() => { setSelectedAdmin(admin); setModal('edit'); }} className='bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition'>
                                                <AiOutlineEdit />
                                            </button>
                                            <button onClick={() => handleDeleteDanhMuc(admin._id)} className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition'>
                                                <AiOutlineDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={Object.keys(defaultAdmin).length + 1} className='text-center py-2'>No users available.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
