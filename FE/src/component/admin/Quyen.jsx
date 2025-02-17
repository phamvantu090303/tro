import React, { useState, useEffect } from "react";
import { Button, Table, Tag, Input, Modal, Form, message, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const QuyenManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [quyenList, setQuyenList] = useState([]);
  const [selectedQuyen, setSelectedQuyen] = useState(null);
  const [functionList, setFunctionList] = useState([]);
  const [selectedFunctions, setSelectedFunctions] = useState([]);
  const [isFunctionListVisible, setIsFunctionListVisible] = useState(false);

  const handleAssignFunctions = async () => {
    try {
      await axios.post(`http://localhost:5000/quyenchucnang/CreatQuyen`, {
        id_quyen: selectedQuyen._id,
        functions: selectedFunctions,
      });

      message.success("Cấp quyền thành công!");
      setIsFunctionListVisible(false);
    } catch (error) {
      message.error("Lỗi khi cấp quyền!");
    }
  };

  const handleFunctionChange = (id_chuc_nang) => {
    setSelectedFunctions((prevSelectedFunctions) => {
      if (prevSelectedFunctions.includes(id_chuc_nang)) {
        return prevSelectedFunctions.filter((id) => id !== id_chuc_nang);
      } else {
        return [...prevSelectedFunctions, id_chuc_nang];
      }
    });

    setFunctionList((prevFunctionList) =>
      prevFunctionList.map((func) =>
        func._id === id_chuc_nang ? { ...func, check: !func.check } : func
      )
    );
  };

  const fetchQuyenList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/phan_quyen/AllQuyen");
      setQuyenList(response.data.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách quyền!");
    }
  };

  const fetchFunctionList = async (quyenId) => {
    try {
      const response = await axios.post(`http://localhost:5000/quyenchucnang/CheckQuyen/${quyenId}`);
      setFunctionList(response.data.data);
      setSelectedFunctions(response.data.data.filter(func => func.check).map(func => func._id));
    } catch (error) {
      message.error("Lỗi khi tải danh sách chức năng!");
    }
  };

  useEffect(() => {
    fetchQuyenList();
  }, []);

  useEffect(() => {
    if (selectedQuyen) {
      fetchFunctionList(selectedQuyen._id);
    }
  }, [selectedQuyen]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleAddQuyen = async () => {
    try {
      const values = await form.validateFields();
      const newQuyen = { ten_quyen: values.ten_quyen, trang_thai: Number(values.trang_thai) };

      await axios.post("http://localhost:5000/phan_quyen/CreatQuyen", newQuyen, {
        headers: { "Content-Type": "application/json" },
      });

      message.success("Thêm mới quyền thành công!");
      setIsModalOpen(false);
      form.resetFields();
      fetchQuyenList();
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm quyền!");
    }
  };

  const handleChangeStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await axios.post(`http://localhost:5000/phan_quyen/UpdateStatus/${id}`, { trang_thai: newStatus });

      setQuyenList((prevList) =>
        prevList.map((item) =>
          item._id === id ? { ...item, trang_thai: newStatus } : item
        )
      );

      message.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái!");
    }
  };

  const handleDeleteQuyen = async (id) => {
    try {
      await axios.post(`http://localhost:5000/phan_quyen/DeleteQuyen/${id}`);
      message.success("Xóa quyền thành công!");
      fetchQuyenList();
    } catch (error) {
      message.error("Lỗi khi xóa quyền!");
    }
  };

  const handleUpdateQuyen = async () => {
    try {
      const values = await updateForm.validateFields();
      const updatedQuyen = { ten_quyen: values.ten_quyen, trang_thai: Number(values.trang_thai) };

      await axios.post(`http://localhost:5000/phan_quyen/UpdateQuyen/${selectedQuyen._id}`, updatedQuyen, {
        headers: { "Content-Type": "application/json" },
      });

      message.success("Cập nhật quyền thành công!");
      setIsUpdateModalOpen(false);
      fetchQuyenList();
    } catch (error) {
      message.error("Lỗi khi cập nhật quyền!");
    }
  };

  const showUpdateModal = (quyen) => {
    setSelectedQuyen(quyen);
    updateForm.setFieldsValue({
      ten_quyen: quyen.ten_quyen,
      trang_thai: quyen.trang_thai,
    });
    setIsUpdateModalOpen(true);
  };

  const showFunctionList = (quyen) => {
    setSelectedQuyen(quyen);
    setIsFunctionListVisible(true);
  };

  const columns = [
    { title: "#", dataIndex: "_id", key: "_id", width: 100, align: "center", render: (_, __, index) => index + 1 },
    { title: "Tên Quyền", dataIndex: "ten_quyen", key: "ten_quyen", align: "center" },
    {
      title: "Trạng Thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      align: "center",
      render: (trang_thai, record) => (
        <Tag
          color={trang_thai === 1 ? "green" : "red"}
          className="cursor-pointer"
          onClick={() => handleChangeStatus(record._id, trang_thai)}
        >
          {trang_thai === 1 ? "Hoạt Động" : "Tạm Tắt"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button type="primary" onClick={() => showFunctionList(record)}>Cấp Quyền</Button>
          <Button type="default" icon={<EditOutlined />} className="bg-blue-500 text-white border-none" onClick={() => showUpdateModal(record)} />
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDeleteQuyen(record._id)} />
        </div>
      ),
    },
  ];

  return (
    <div className="p-5 bg-gray-100 min-h-screen flex gap-5">
      <div className="bg-white p-5 rounded-lg shadow-md w-2/3">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Danh Sách Quyền</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Thêm mới quyền
          </Button>
        </div>
        <Table dataSource={quyenList} columns={columns} rowKey="_id" pagination={false} />
      </div>

      {isFunctionListVisible && (
        <div className="bg-white p-5 rounded-lg shadow-md w-full md:w-1/3">
          <h2 className="text-lg font-semibold mb-3">Phân Quyền</h2>
          <div className="mb-3">
            <p className="font-semibold text-gray-700">
              Cấp quyền cho: <span className="text-blue-500">{selectedQuyen?.ten_quyen}</span>
            </p>
            {functionList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {functionList.map((func) => (
                  <div key={func._id} className="flex items-center space-x-2 p-2 border rounded-md shadow-sm">
                    <input
                      type="checkbox"
                      id={func._id}
                      value={func._id}
                      className="h-4 w-4"
                      checked={func.check}
                      onChange={() => handleFunctionChange(func._id)}
                    />
                    <label htmlFor={func._id} className="text-gray-700 truncate min-w-0">{func.ten_chuc_nang}</label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Không có chức năng nào!</p>
            )}
          </div>
          <Button type="primary" block onClick={handleAssignFunctions}>
            Cấp Quyền
          </Button>
        </div>
      )}

      <Modal title="Thêm mới quyền" open={isModalOpen} onCancel={handleCancel} onOk={handleAddQuyen}>
        <Form form={form} layout="vertical">
          <Form.Item name="ten_quyen" label="Tên Quyền" rules={[{ required: true, message: "Vui lòng nhập tên quyền!" }]}>
            <Input placeholder="Nhập tên quyền..." />
          </Form.Item>
          <Form.Item name="trang_thai" label="Trạng Thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}>
            <Select placeholder="Chọn trạng thái">
              <Option value={1}>Hoạt Động</Option>
              <Option value={0}>Tạm Tắt</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Cập nhật quyền" open={isUpdateModalOpen} onCancel={() => setIsUpdateModalOpen(false)} onOk={handleUpdateQuyen}>
        <Form form={updateForm} layout="vertical">
          <Form.Item name="ten_quyen" label="Tên Quyền">
            <Input />
          </Form.Item>
          <Form.Item name="trang_thai" label="Trạng Thái">
            <Select>
              <Option value={1}>Hoạt Động</Option>
              <Option value={0}>Tạm Tắt</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuyenManagement;