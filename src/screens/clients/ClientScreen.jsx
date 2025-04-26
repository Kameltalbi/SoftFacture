import React from "react";
import { Table, Button, Popconfirm } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { deleteClient } from "../../container/redux/slices/clientsSlice";
import { useNavigate } from "react-router-dom";
import { PRIMARY } from "../../utils/constants/colors";
import ActionsDropdown from "../../components/common/ActionsDropdown";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const ClientScreen = () => {
  const { clients } = useSelector((state) => state.clients);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = (id) => {
    dispatch(deleteClient(id));
  };

  const columns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Company", dataIndex: "company", key: "company" },
    { title: "Fiscal ID", dataIndex: "fiscalId", key: "fiscalId" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <ActionsDropdown
          menuItems={[
            {
              key: "edit",
              label: "Edit",
              icon: <EditOutlined />,
              onClick: () => navigate(`/clients/edit/${record.id}`),
            },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDelete(record.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Clients</h1>
        <Button type="primary" onClick={() => navigate("/clients/create")}>
          Add New Client
        </Button>
      </div>

      <Table dataSource={clients} columns={columns} rowKey="id" />
    </div>
  );
};

export default ClientScreen;
