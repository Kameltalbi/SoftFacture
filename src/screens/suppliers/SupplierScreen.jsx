import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, message, Spin, Alert, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchSuppliers, deleteSupplier, clearError } from "../../container/redux/slices/supplierSlice";
import { PRIMARY } from "../../utils/constants/colors";

const SupplierScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { suppliers, loading, error } = useSelector((state) => state.suppliers);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteSupplier(id)).unwrap();
      message.success("Supplier deleted successfully");
    } catch (error) {
      message.error(error || "Failed to delete supplier");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
      ellipsis: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => (a.phone || "").localeCompare(b.phone || ""),
      ellipsis: true,
    },
    {
      title: "Address",
      dataIndex: "adress",
      key: "adress",
      sorter: (a, b) => (a.adress || "").localeCompare(b.adress || ""),
      ellipsis: true,
      width: 200,
    },
    {
      title: "VAT Code",
      dataIndex: "code_tva",
      key: "code_tva",
      sorter: (a, b) => (a.code_tva || "").localeCompare(b.code_tva || ""),
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/suppliers/edit/${record.id}`)}
          />
          <Popconfirm
            title="Delete supplier"
            description="Are you sure you want to delete this supplier?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading && !suppliers.length) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" type="primary" onClick={() => dispatch(fetchSuppliers())}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Suppliers</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/suppliers/create")}
          style={{ backgroundColor: PRIMARY }}
        >
          Add Supplier
        </Button>
      </div>

      <Table
        dataSource={suppliers}
        columns={columns}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
      />
    </div>
  );
};

export default SupplierScreen;